import z, { email } from "zod";




export const signUpSchema = z.object({
   username: z.string().regex(/^[a-zA-Z0-9]+$/,{
            message: "Name can only contain letters and numbers",
            })
            .min(3,{message:'username must be at least 3 characters'})
            .max(10,{message:'username cannot exceed 10 characters'}),
            email: z.email({message:"Invalid email address"}),
            password: z.string()
                    .min(8, "Password must be at least 8 characters")
                    .regex(/^[A-Za-z0-9@$!%*?&]+$/, "Invalid characters"),
})


export const signInSchema = z.object({
        email: z.email({message:"Invalid email address"}),
        password: z.string()
                    .min(8, "Password must be at least 8 characters")
                    .regex(/^[A-Za-z0-9@$!%*?&]+$/, "Invalid characters"),
})


export const resetPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^[A-Za-z0-9@$!%*?&]+$/, "Invalid characters"),
    confirmNewPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^[A-Za-z0-9@$!%*?&]+$/, "Invalid characters"),
}).refine((data) => data.confirmNewPassword === data.newPassword,{
    path:['confirmNewPassword'],
    message:'Passwords do not match'
})