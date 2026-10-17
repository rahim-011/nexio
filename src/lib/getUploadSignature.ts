


export const getSignature = async (folderName:string) => {
    const response = await fetch(`/api/upload-signature?folder=${folderName}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Failed to get the signature");
    }

    return response.json();
};

