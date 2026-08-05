import app from "./app";
import { env } from "./config/env";
import { registerShutdown } from "./utils/shutdown";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Vault Server running on http://localhost:${env.PORT}`);
});

registerShutdown(server);