
import { UploadFolders } from "./types";
import { getSignature } from "./getUploadSignature";


export const uploadToCloudinary = async (file: File,folderName:UploadFolders) => {
    const {
        signature,
        preset,
        apiKey,
        cloudName,
        requestedFolder,
        timestamp,
    } = await getSignature(folderName);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", preset);
    formData.append("folder", requestedFolder);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);

    const uploaded = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!uploaded.ok) {
        throw new Error("Upload has failed");
    }

    const data = await uploaded.json();

    return {
          url: data.secure_url as string,
          publicId: data.public_id as string,
          resourceType: data.resource_type as "image" | "video",
      };
    };