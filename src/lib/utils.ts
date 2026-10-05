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
