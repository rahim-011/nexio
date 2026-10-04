'use client'

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import AddFriend from "./FriendsComponents/AddFriend";

export default function SearchBar({placeHolder}:{placeHolder:string}){
    const [isOpen,setIsOpen] = useState<boolean>(false);
    const dropDownRef = useRef<HTMLDivElement | null>(null)
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentSearch,setCurrentSearch] = useState<string>(searchParams.get('q') || '');

    useEffect(() => {
        const query = searchParams.get('q') || '';
        setCurrentSearch(query);
    }, [searchParams]); 

    const handleSearch = useDebouncedCallback((value:string) =>{
        const params = new URLSearchParams(searchParams);
        if (value.trim()){
            params.set('q',value.trim())
        }else{
            params.delete('q')   
        }

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl,{scroll:false})
    },150)

    const clearSearch = () => {
        setCurrentSearch('');
        const params = new URLSearchParams(searchParams);
        params.delete('q');
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl, {scroll: false});
    };

    useEffect(()=>{
        function closeDropDown(e:MouseEvent){
            if (dropDownRef.current && !dropDownRef.current.contains(e.target as Node)){
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown',closeDropDown);
        return () => document.removeEventListener('mousedown',closeDropDown)
    },[])

    return(
        <div className="relative" ref={dropDownRef}>
            <div className="relative flex items-center">
                <Search size={20} className="text-grey7 absolute left-4 pointer-events-none"/>
                <input 
                    value={currentSearch} 
                    type="text" 
                    placeholder={placeHolder} 
                    className="text-grey7 pl-12 pr-10 py-3 rounded-lg bg-grey1 w-full ring-0 focus-within:ring-0 outline-0 text-[1.3rem] placeholder:text-[1rem]" 
                    onChange={(e)=>{
                        setCurrentSearch(e.target.value);
                        handleSearch(e.target.value);
                    }} 
                    onClick={()=>setIsOpen(true)}
                />
                {currentSearch && (
                    <X size={20} className="text-grey7 absolute right-4 cursor-pointer hover:text-grey9 transition-colors" onClick={clearSearch}/>
                )}
            </div>
            {isOpen && (
                <div className="absolute left-0 right-0 z-50 bg-primary9 mt-1 rounded-b-lg p-3 shadow-2xl min-h-auto origin-top animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col gap-3">
                    <AddFriend/>
                    <AddFriend/>
                </div>
            )}
        </div>
    )
}