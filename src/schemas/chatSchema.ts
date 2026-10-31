import z from "zod";





export const messageSchema = z.object({
    chatId: z.string().min(1),
    content: z.string().trim().max(5000).optional().default(""),
    media: z.array(
        z.object({
            publicId: z.string().min(1, { message: "Public id is required!" }),
            resourceType: z.enum(["image", "video"]),
            url: z.url().refine(
                (url) => {
                    try {
                        return new URL(url).hostname === "res.cloudinary.com";
                    } catch {
                        return false;
                    }
                },
                { message: "Invalid Cloudinary URL" }
            ),
        })
    ),
}).refine(
    (data) => data.content.length > 0 || data.media.length > 0,
    {
        message: "Message cannot be empty",
        path: ["content"]
    }
);
