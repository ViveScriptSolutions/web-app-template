import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Basic check, can be made stronger
});

export type SignInFormValues = z.infer<typeof signInSchema>;

// Example for a potential sign-up schema (not implemented in form yet)
export const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters."}).optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // path of error
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
