import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.objectEnumValues.instances.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: {
    "__#private@#private": any;
    _getNamespace(): string;
    _getName(): string;
    toString(): string;
};
export declare const ModelName: {
    readonly User: "User";
    readonly Category: "Category";
    readonly Dish: "Dish";
    readonly ShippingZone: "ShippingZone";
    readonly Voucher: "Voucher";
    readonly Order: "Order";
    readonly OrderItem: "OrderItem";
    readonly Notification: "Notification";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly phone: "phone";
    readonly address: "address";
    readonly role: "role";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const CategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum];
export declare const DishScalarFieldEnum: {
    readonly id: "id";
    readonly categoryId: "categoryId";
    readonly name: "name";
    readonly description: "description";
    readonly price: "price";
    readonly imageUrl: "imageUrl";
    readonly isFeatured: "isFeatured";
    readonly isAvailable: "isAvailable";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type DishScalarFieldEnum = (typeof DishScalarFieldEnum)[keyof typeof DishScalarFieldEnum];
export declare const ShippingZoneScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly fee: "fee";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ShippingZoneScalarFieldEnum = (typeof ShippingZoneScalarFieldEnum)[keyof typeof ShippingZoneScalarFieldEnum];
export declare const VoucherScalarFieldEnum: {
    readonly id: "id";
    readonly code: "code";
    readonly description: "description";
    readonly discountType: "discountType";
    readonly discountValue: "discountValue";
    readonly minOrder: "minOrder";
    readonly maxDiscount: "maxDiscount";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type VoucherScalarFieldEnum = (typeof VoucherScalarFieldEnum)[keyof typeof VoucherScalarFieldEnum];
export declare const OrderScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly total: "total";
    readonly shippingFee: "shippingFee";
    readonly discount: "discount";
    readonly status: "status";
    readonly note: "note";
    readonly addressSnapshot: "addressSnapshot";
    readonly phoneSnapshot: "phoneSnapshot";
    readonly voucherId: "voucherId";
    readonly shippingZoneId: "shippingZoneId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrderScalarFieldEnum = (typeof OrderScalarFieldEnum)[keyof typeof OrderScalarFieldEnum];
export declare const OrderItemScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly dishId: "dishId";
    readonly quantity: "quantity";
    readonly unitPrice: "unitPrice";
};
export type OrderItemScalarFieldEnum = (typeof OrderItemScalarFieldEnum)[keyof typeof OrderItemScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly message: "message";
    readonly status: "status";
    readonly orderId: "orderId";
    readonly createdAt: "createdAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const UserOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly phone: "phone";
    readonly address: "address";
};
export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum];
export declare const CategoryOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly description: "description";
};
export type CategoryOrderByRelevanceFieldEnum = (typeof CategoryOrderByRelevanceFieldEnum)[keyof typeof CategoryOrderByRelevanceFieldEnum];
export declare const DishOrderByRelevanceFieldEnum: {
    readonly name: "name";
    readonly description: "description";
    readonly imageUrl: "imageUrl";
};
export type DishOrderByRelevanceFieldEnum = (typeof DishOrderByRelevanceFieldEnum)[keyof typeof DishOrderByRelevanceFieldEnum];
export declare const ShippingZoneOrderByRelevanceFieldEnum: {
    readonly name: "name";
};
export type ShippingZoneOrderByRelevanceFieldEnum = (typeof ShippingZoneOrderByRelevanceFieldEnum)[keyof typeof ShippingZoneOrderByRelevanceFieldEnum];
export declare const VoucherOrderByRelevanceFieldEnum: {
    readonly code: "code";
    readonly description: "description";
};
export type VoucherOrderByRelevanceFieldEnum = (typeof VoucherOrderByRelevanceFieldEnum)[keyof typeof VoucherOrderByRelevanceFieldEnum];
export declare const OrderOrderByRelevanceFieldEnum: {
    readonly note: "note";
    readonly addressSnapshot: "addressSnapshot";
    readonly phoneSnapshot: "phoneSnapshot";
};
export type OrderOrderByRelevanceFieldEnum = (typeof OrderOrderByRelevanceFieldEnum)[keyof typeof OrderOrderByRelevanceFieldEnum];
export declare const NotificationOrderByRelevanceFieldEnum: {
    readonly message: "message";
};
export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map