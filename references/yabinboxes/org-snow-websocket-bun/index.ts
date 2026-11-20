import { WebSocketServer } from "./src/server";
import { WebSocketClient } from "./src/client";

const SERVER_PORT = 3000;
const SERVER_URL = `ws://localhost:${SERVER_PORT}`;

// Start WebSocket server
console.log("Starting WebSocket server...");
const server = new WebSocketServer(SERVER_PORT);
server.start();

// Scheduler task: Call API with GET request every 30 seconds and count the number of clients connected
const API_URL = process.env.API_URL || "http://localhost:8080/connectors/get-snow-deployments?email=yabin.monroy.1@gmail.com&type=ALL";
const apiSchedulerInterval = setInterval(async () => {
  try {

    const timestamp = new Date().toISOString();
    const clientCount = server.getClientCount();
    console.log(`[Scheduler] ${timestamp} - Server status: ${clientCount} client(s) connected`);

    console.log(`[API Scheduler] ${timestamp} - Calling GET ${API_URL}...`);

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "User-Agent": "snow-websocket-bun/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json().catch(() => response.text());
    console.log(`[API Scheduler] ${timestamp} - Response received:`, {
      status: response.status,
      statusText: response.statusText,
      data: typeof data === "string" ? data.substring(0, 100) + "..." : data,
    });

    // Broadcast API response to all connected WebSocket clients
    const apiResponseMessage = {
      type: "api_response",
      timestamp,
      url: API_URL,
      status: response.status,
      statusText: response.statusText,
      data,
    };
    const sentCount = server.broadcastToAll(apiResponseMessage);
    if (sentCount > 0) {
      console.log(`[API Scheduler] ${timestamp} - Broadcasted API response to ${sentCount} client(s)`);
    }
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[API Scheduler] ${timestamp} - Error calling API:`, error instanceof Error ? error.message : error);
    
    // Broadcast error to all connected WebSocket clients
    const errorMessage = {
      type: "api_error",
      timestamp,
      url: API_URL,
      error: error instanceof Error ? error.message : String(error),
    };
    const sentCount = server.broadcastToAll(errorMessage);
    if (sentCount > 0) {
      console.log(`[API Scheduler] ${timestamp} - Broadcasted API error to ${sentCount} client(s)`);
    }
  }
}, 30000); // 30 seconds = 30000 milliseconds

// Example: Create a client and connect to the server
// This is optional - you can connect from external clients too
if (process.argv.includes("--with-client")) {
  const client = new WebSocketClient({
    url: SERVER_URL,
    reconnectInterval: 2000,
    maxReconnectAttempts: 5,
    onOpen: () => {
      console.log("[Demo] Client opened connection");

      // Send a test message after connection
      setTimeout(() => {
        client.send({
          type: "greeting",
          message: "Hello from client!",
        });
      }, 1000);
    },
    onMessage: (message) => {
      console.log("[Demo] Client received:", message);
    },
    onClose: (event) => {
      console.log("[Demo] Client closed:", event.code, event.reason);
    },
    onError: (error) => {
      console.error("[Demo] Client error:", error);
    },
  });

  // Connect the client
  client.connect().catch((error) => {
    console.error("[Demo] Failed to connect client:", error);
  });

  // Send periodic messages
  const interval = setInterval(() => {
    if (client.isConnected()) {
      client.send({
        type: "ping",
        timestamp: Date.now(),
      });
    }
  }, 5000);

  // Cleanup on exit
  process.on("SIGINT", () => {
    console.log("\n[Demo] Shutting down...");
    clearInterval(interval);
    clearInterval(apiSchedulerInterval);
    client.close(1000, "Shutting down");
    process.exit(0);
  });
} else {
  console.log("\nWebSocket server is running!");
  console.log(`Connect to: ${SERVER_URL}`);
  console.log("\nTo run with a demo client, use: bun run index.ts --with-client");
  console.log("\nPress Ctrl+C to stop the server.\n");

  // Keep the process alive
  process.on("SIGINT", () => {
    console.log("\n[Server] Shutting down...");
    clearInterval(apiSchedulerInterval);
    process.exit(0);
  });
}