import { z } from "zod";

export const OrderStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
]);

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  size: z.string(),
  color: z.string().optional(),
  image: z.string().url(),
});

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  items: z.array(OrderItemSchema).nonempty(),
  shippingAddressId: z.string().optional(),
  paymentMethod: z.string().optional(),
});
