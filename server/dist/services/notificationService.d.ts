import { Server } from "socket.io";
type OrderUpdatePayload = {
    orderId: number;
    status: string;
    message: string;
};
export declare const registerNotificationGateway: (server: Server) => void;
export declare const emitOrderUpdate: (userId: number, payload: OrderUpdatePayload) => Promise<void>;
export {};
//# sourceMappingURL=notificationService.d.ts.map