export declare const Role: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const OrderStatus: {
    readonly PENDING: "PENDING";
    readonly PREPARING: "PREPARING";
    readonly DELIVERING: "DELIVERING";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
export declare const DiscountType: {
    readonly PERCENTAGE: "PERCENTAGE";
    readonly FIXED: "FIXED";
};
export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];
export declare const NotificationStatus: {
    readonly UNREAD: "UNREAD";
    readonly READ: "READ";
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
//# sourceMappingURL=enums.d.ts.map