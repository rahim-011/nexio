'use client'


export { cn } from "cn"




export const clearSearch = (
    pathname:string,
    searchParams:URLSearchParams,
    router:any
) => {
    const params = new URLSearchParams(searchParams);
    if (params){
        params.delete('q')
    }

    const queryString = params.toString();
    const clearedUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(clearedUrl,{scroll:false})
}


export const fileToBase64 = (file:File):Promise<string> =>{ 
    return new Promise((resolve,reject) =>{
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file);
    })
}
