"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const notificationService_1 = require("./services/notificationService");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: env_1.env.CLIENT_ORIGINS,
        credentials: true,
    },
});
(0, notificationService_1.registerNotificationGateway)(io);
server.listen(env_1.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API running on http://localhost:${env_1.env.PORT}`);
});
process.on("unhandledRejection", (reason) => {
    // eslint-disable-next-line no-console
    console.error("Unhandled rejection", reason);
});
//# sourceMappingURL=index.js.map