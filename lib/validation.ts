import { z } from "zod"

/* =========================
   SIGNUP VALIDATION
========================= */

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  confirmPassword: z.string().min(6),

  role: z.enum(["citizen", "authority"]),

  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

/* =========================
   LOGIN VALIDATION
========================= */

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(1, "Password is required"),

  role: z.enum(["citizen", "authority"]),
})

/* =========================
   COMPLAINT VALIDATION
========================= */

export const complaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),

  description: z.string().min(10, "Description must be at least 10 characters"),

  location: z.string().min(5, "Location is required"),

  state: z.string().min(1, "State is required"),

  district: z.string().min(1, "District is required"),

  ward: z.string().optional(),

  category: z.enum([
    "Roads",
    "Water",
    "Electricity",
    "Healthcare",
    "Sanitation",
    "Safety",
  ]),
})

/* =========================
   COMPLAINT STATUS UPDATE
========================= */

export const updateComplaintStatusSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Resolved']),

  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),

  category: z.enum([
    'Roads',
    'Water',
    'Electricity',
    'Healthcare',
    'Sanitation',
    'Safety'
  ]).optional()
})

/* =========================
   TYPES
========================= */

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ComplaintInput = z.infer<typeof complaintSchema>
export type UpdateComplaintStatusInput = z.infer<typeof updateComplaintStatusSchema>