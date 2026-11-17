import { z } from "zod";

export const enquirySchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your full name").max(120),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  division: z.enum(["human_health", "agrovet", "general"]),
  product_name: z.string().trim().max(200).optional().or(z.literal("")),
  quantity: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please enter a message").max(3000),
});
export type EnquiryInput = z.infer<typeof enquirySchema>;
