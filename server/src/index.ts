import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function main() {
  await connectDB();

  const app = createApp();
  const httpServer = http.createServer(app);

  // Realtime layer (notifications, live counters) - wired up as features land in
  // Phase 1+. Kept minimal here so the transport exists from day one.
  const io = new SocketIOServer(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.on("connection", (socket) => {
    socket.on("join", (userId: string) => socket.join(`user:${userId}`));
  });

  app.set("io", io);

  httpServer.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
