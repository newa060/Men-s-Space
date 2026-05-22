import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  sku: z.string().optional(),
  price: z.number().positive("Price must be greater than zero"),
  stock: z.number().int().nonnegative("Stock must be zero or more"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  status: z.enum(["Active", "Draft", "Archived"]).default("Active"),
  image: z.string().url("Image must be a valid URL"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sizes: z.array(z.string()).nonempty("At least one size is required"),
  images: z.array(z.string()).optional(),
  colors: z.array(
    z.object({
      name: z.string(),
      hex: z.string(),
    })
  ).optional(),
  materials: z.string().optional(),
  waterproof: z.string().optional(),
  breathability: z.string().optional(),
  hardware: z.string().optional(),
  seams: z.string().optional(),
  isNewArrival: z.boolean().optional(),
  series: z.string().optional(),
});
