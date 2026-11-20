export interface WebSocketClientOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onOpen?: () => void;
  onMessage?: (message: unknown) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionallyClosed: boolean = false;

  private onOpen?: () => void;
  private onMessage?: (message: unknown) => void;
  private onClose?: (event: CloseEvent) => void;
  private onError?: (error: Event) => void;

  constructor(options: WebSocketClientOptions) {
    this.url = options.url;
    this.reconnectInterval = options.reconnectInterval ?? 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 10;
    this.onOpen = options.onOpen;
    this.onMessage = options.onMessage;
    this.onClose = options.onClose;
    this.onError = options.onError;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log(`[Client] Connecting to ${this.url}...`);
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log(`[Client] Connected to ${this.url}`);
          this.reconnectAttempts = 0;
          this.onOpen?.();
          resolve();
        };

        this.ws.onmessage = (event) => {
          let message: unknown;
          try {
            message = JSON.parse(event.data as string);
          } catch {
            message = event.data;
          }
          console.log(`[Client] Message received:`, message);
          this.onMessage?.(message);
        };

        this.ws.onclose = (event) => {
          console.log(`[Client] Connection closed:`, {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });
          this.ws = null;
          this.onClose?.(event);

          // Attempt to reconnect if not intentionally closed
          if (!this.isIntentionallyClosed) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error(`[Client] WebSocket error:`, error);
          this.onError?.(error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`[Client] Max reconnect attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * this.reconnectAttempts;
    console.log(`[Client] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error(`[Client] Reconnection failed:`, error);
      });
    }, delay);
  }

  send(message: unknown): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn(`[Client] Cannot send message: WebSocket is not open`);
      return false;
    }

    try {
      const data = typeof message === "string" ? message : JSON.stringify(message);
      this.ws.send(data);
      console.log(`[Client] Message sent:`, message);
      return true;
    } catch (error) {
      console.error(`[Client] Error sending message:`, error);
      return false;
    }
  }

  close(code?: number, reason?: string) {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(code, reason);
      this.ws = null;
    }
  }

  getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

