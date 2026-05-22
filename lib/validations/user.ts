import { z } from "zod";

export const ProfileUpdateSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const AddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  line1: z.string().min(5, "Address line 1 must be at least 5 characters"),
  line2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  postcode: z.string().min(3, "Postcode must be at least 3 characters"),
  isDefault: z.boolean().default(false),
});
