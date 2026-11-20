import type { ServerWebSocket } from "bun";

interface WebSocketData {
  id: string;
  connectedAt: number;
  [key: string]: unknown;
}

export class WebSocketServer {
  private port: number;
  private clients: Map<string, ServerWebSocket<WebSocketData>> = new Map();

  constructor(port: number = 3000) {
    this.port = port;
  }

  start() {
    const startedAt = Date.now();

    const server = Bun.serve<WebSocketData>({
      port: this.port,
      fetch: (req, server) => {
        const url = new URL(req.url);
        const corsHeaders = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        };

        if (req.method === "OPTIONS") {
          return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (req.method === "GET" && url.pathname === "/health") {
          return Response.json({
            status: "ok",
            connectedClients: this.clients.size,
            uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
            timestamp: new Date().toISOString(),
          }, { headers: corsHeaders });
        }

        // Upgrade HTTP request to WebSocket
        if (server.upgrade(req, {
          data: {
            id: crypto.randomUUID(),
            connectedAt: Date.now(),
          },
        })) {
          return; // WebSocket upgrade successful
        }
        return new Response("Expected WebSocket connection", { status: 400 });
      },
      websocket: {
        open: (ws) => {
          const clientId = ws.data.id;
          this.clients.set(clientId, ws);
          console.log(`[Server] Client connected: ${clientId}`);
          
          // Send welcome message
          ws.send(JSON.stringify({
            type: "welcome",
            clientId,
            message: "Connected to WebSocket server",
            timestamp: Date.now(),
          }));

          // Notify other clients
          this.broadcast({
            type: "client_joined",
            clientId,
            totalClients: this.clients.size,
          }, clientId);
        },
        message: (ws, message) => {
          const clientId = ws.data.id;
          let parsedMessage: unknown;

          // Handle both string and binary messages
          if (typeof message === "string") {
            try {
              parsedMessage = JSON.parse(message);
            } catch {
              parsedMessage = { text: message };
            }
          } else {
            parsedMessage = { binary: Array.from(new Uint8Array(message)) };
          }

          console.log(`[Server] Message from ${clientId}:`, parsedMessage);

          // Echo message back to sender
          ws.send(JSON.stringify({
            type: "echo",
            original: parsedMessage,
            timestamp: Date.now(),
          }));

          // Broadcast to all other clients
          this.broadcast({
            type: "broadcast",
            from: clientId,
            message: parsedMessage,
            timestamp: Date.now(),
          }, clientId);
        },
        close: (ws) => {
          const clientId = ws.data.id;
          this.clients.delete(clientId);
          console.log(`[Server] Client disconnected: ${clientId}`);

          // Notify remaining clients
          this.broadcast({
            type: "client_left",
            clientId,
            totalClients: this.clients.size,
          });
        },
      },
    });

    console.log(`[Server] WebSocket server started on ws://localhost:${this.port}`);
    return server;
  }

  private broadcast(message: unknown, excludeClientId?: string) {
    const messageStr = JSON.stringify(message);
    for (const [clientId, ws] of this.clients.entries()) {
      if (clientId !== excludeClientId && ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
      }
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }

  sendToClient(clientId: string, message: unknown): boolean {
    const ws = this.clients.get(clientId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  broadcastToAll(message: unknown): number {
    let sentCount = 0;
    const messageStr = JSON.stringify(message);
    for (const [clientId, ws] of this.clients.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
        sentCount++;
      }
    }
    return sentCount;
  }
}

