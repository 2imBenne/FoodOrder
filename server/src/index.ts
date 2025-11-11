import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { env } from "./config/env";
import { registerNotificationGateway } from "./services/notificationService";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CLIENT_ORIGINS,
    credentials: true,
  },
});

registerNotificationGateway(io);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${env.PORT}`);
});

process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled rejection", reason);
});
