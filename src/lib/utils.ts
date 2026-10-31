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


export const getPostedTime = (postedTime: Date) => {
    const date = new Date(postedTime);
  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return postedTime.toLocaleDateString();
};









