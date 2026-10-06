import z from "zod";




export const pfpSchema = z.object({
    profileImage: z.url({message:'Please provide a valid image URL'})
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