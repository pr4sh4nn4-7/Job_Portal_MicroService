
import z from 'zod'
import { parsePhoneNumberFromString } from "libphonenumber-js"



const MAX_FILE_SIZE = 5 * 1024 * 1024

export const RegisterSchema = z.object({
  name: z.string().min(8, "Name must be at least 8 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().refine((value) => {
    const phone = parsePhoneNumberFromString(value)
    return phone?.isValid() ?? false
  }, { message: "Phone number is invalid" }),
  role: z.enum(["jobseeker", "recruiter"]),
  bio: z.string().optional(),
  resume: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.role === "jobseeker") {
    if (!data.bio || data.bio.length < 10) {
      ctx.addIssue({ path: ["bio"], message: "Bio must be at least 10 characters", code: z.ZodIssueCode.custom })
    }
    if (data.resume && data.resume.size > MAX_FILE_SIZE) {
      ctx.addIssue({ path: ["resume"], message: "File must be less than 5MB", code: z.ZodIssueCode.custom })
    }
  }
})
