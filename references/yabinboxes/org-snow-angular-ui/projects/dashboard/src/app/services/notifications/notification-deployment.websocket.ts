import { Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum WebSocketConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationDeployment {
  private ws?: WebSocket;
  private readonly messageSubject = new Subject<string>();
  private readonly errorSubject = new Subject<Error>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout?: ReturnType<typeof setTimeout>;
  private connectionUrl?: string;
  private autoReconnect = true;
  private intentionalClose = false;

  readonly connectionState = signal<WebSocketConnectionState>(WebSocketConnectionState.DISCONNECTED);
  readonly isConnected = signal<boolean>(false);

  /**
   * Connect to WebSocket server
   * @param url WebSocket server URL
   * @param autoReconnect Whether to automatically reconnect on disconnect (default: true)
   */
  connect(url: string, autoReconnect = true): void {
    if (this.ws?.readyState === WebSocket.OPEN && this.connectionUrl === url) {
      console.warn('WebSocket already connected');
      return;
    }

    this.closeSocket();
    this.clearReconnectTimeout();

    this.intentionalClose = false;
    this.autoReconnect = autoReconnect;
    this.connectionUrl = url;
    this.connectionState.set(WebSocketConnectionState.CONNECTING);

    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      if (this.ws !== ws) return;
      console.log('WebSocket connection established');
      this.connectionState.set(WebSocketConnectionState.CONNECTED);
      this.isConnected.set(true);
      this.reconnectAttempts = 0;
    };

    ws.onmessage = (event) => {
      if (this.ws !== ws) return;
      try {
        this.messageSubject.next(event.data);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
        this.errorSubject.next(error as Error);
      }
    };

    ws.onerror = () => {
      if (this.ws !== ws) return;
      console.error('WebSocket error');
      this.connectionState.set(WebSocketConnectionState.ERROR);
      this.isConnected.set(false);
      this.errorSubject.next(new Error('WebSocket connection error'));
    };

    ws.onclose = (event) => {
      if (this.ws !== ws) return;
      console.log('WebSocket connection closed', event.code, event.reason);
      this.ws = undefined;
      this.connectionState.set(WebSocketConnectionState.DISCONNECTED);
      this.isConnected.set(false);

      if (
        this.autoReconnect &&
        !this.intentionalClose &&
        event.code !== 1000 &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.scheduleReconnect();
      }
    };
  }

  /**
   * Schedule a reconnection attempt
   */
  private scheduleReconnect(): void {
    this.clearReconnectTimeout();

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(`Scheduling WebSocket reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = undefined;
      if (this.connectionUrl && !this.intentionalClose) {
        this.connect(this.connectionUrl, true);
      }
    }, delay);
  }

  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = undefined;
    }
  }

  private closeSocket(): void {
    if (!this.ws) return;

    const ws = this.ws;
    this.ws = undefined;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;

    if (
      ws.readyState === WebSocket.CONNECTING ||
      ws.readyState === WebSocket.OPEN
    ) {
      ws.close(1000, 'Client disconnect');
    }
  }

  /**
   * Send a message through the WebSocket connection
   * @param message Message to send
   * @throws Error if connection is not open
   */
  sendMessage(message: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }
    this.ws.send(message);
  }

  /**
   * Get messages as an Observable
   * @returns Observable of WebSocket messages
   */
  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  /**
   * Get errors as an Observable
   * @returns Observable of WebSocket errors
   */
  getErrors(): Observable<Error> {
    return this.errorSubject.asObservable();
  }

  /**
   * Disconnect from WebSocket server and cancel reconnects.
   */
  disconnect(): void {
    this.intentionalClose = true;
    this.autoReconnect = false;
    this.clearReconnectTimeout();
    this.closeSocket();
    this.connectionState.set(WebSocketConnectionState.DISCONNECTED);
    this.isConnected.set(false);
    this.connectionUrl = undefined;
    this.reconnectAttempts = 0;
  }
}
