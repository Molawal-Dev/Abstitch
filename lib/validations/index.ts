import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export const orderEnquirySchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number").max(20),
  school_or_organisation: z.string().max(200).optional(),
  items_required: z.string().min(5, "Please describe the items required").max(2000),
  quantity: z.string().min(1, "Please provide an estimated quantity").max(100),
  embroidery_required: z.boolean(),
  logo_description: z.string().max(1000).optional(),
  additional_notes: z.string().max(2000).optional(),
});

export const checkoutSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number").max(20),
  address_line_1: z.string().min(5, "Address is required").max(200),
  address_line_2: z.string().max(200).optional(),
  city: z.string().min(2, "City is required").max(100),
  county: z.string().max(100).optional(),
  postcode: z
    .string()
    .min(5, "Please enter a valid postcode")
    .max(10)
    .regex(/^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i, "Invalid UK postcode"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().max(500).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required").max(300),
  slug: z.string().min(2).max(300).optional(),
  type: z.enum(["simple", "variable"]),
  sku: z.string().max(100).optional(),
  short_description: z.string().max(500).optional(),
  description: z.string().max(10000).optional(),
  regular_price: z.number().min(0).optional(),
  sale_price: z.number().min(0).optional().nullable(),
  images: z.array(z.string().url()).default([]),
  in_stock: z.boolean().default(true),
  stock_qty: z.number().int().min(0).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  category_ids: z.array(z.string().uuid()).default([]),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type OrderEnquiryValues = z.infer<typeof orderEnquirySchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
