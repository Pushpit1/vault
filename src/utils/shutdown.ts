import { Server } from "http";

export const registerShutdown = (server: Server) => {
  const shutdown = (signal: string) => {
    console.log(`\n🛑 ${signal} received. Starting graceful shutdown...`);

    server.close((error) => {
      if (error) {
        console.error("❌ Error while closing HTTP server:", error);
        process.exit(1);
      }

      console.log("✅ HTTP server closed.");
      console.log("👋 Vault stopped successfully.");

      process.exit(0);
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};