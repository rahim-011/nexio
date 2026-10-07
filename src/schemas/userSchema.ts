import z from "zod";




export const pfpSchema = z.object({
    profileImage: z.url({message:'Please provide a valid image URL'})
})


export const postSchema = z.object({
    postPicture: z.url({message:'Please provide a valid image URL'}),
    postCaption: z.string().min(10,{message:'Caption must be less than 200 characters'})
})

export const bioSchema = z.object({
    bio: z.string().max(160,"Bio must be less than 160 characters")
})


export const editProfileSchema = z.object({
    name: z.string().min(2,{message:'Name must be at least 2 characters'}).max(10,{message:'Name cannot exceed 10 characters'}).optional(),
    username: z.string().regex(/^[a-zA-Z0-9]+$/, {
        message: "Name can only contain letters and numbers",
    })
    .min(3,{message:'username must be at least 3 characters'})
    .max(10,{message:'username cannot exceed 10 characters'})
})

export const editEmailSchema = z.object({
    email: z.email({message:'Invalid email address'})
})


export const editPasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^[A-Za-z0-9@$!%*?&]+$/, "Invalid characters"),
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
