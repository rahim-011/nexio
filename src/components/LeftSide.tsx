'use client'

import { Bell, Ellipsis, MessageCircle, Plus, Power, Search, Settings, User, Users } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileIcon from "./ProfileIcon";
import { useEffect, useRef, useState } from "react";
import MainSearch from "./MainSearch";
import PostModel from "./PostModel";

export default function LeftSide(){
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isModelOpen,setIsModelOpen] = useState<boolean>(false);
    const [isPostOpen,setIsPostOpen] = useState<boolean>(false);
    const closeModel = useRef<HTMLDivElement | null>(null);
    const navLinks = [
        {label: 'Search', icon: <Search size={22} className="text-grey3 mb-1"/>, path: '/search'},
        {label: 'Chats', icon: <MessageCircle size={22} className="text-grey3 mb-1"/>, path: '/messages'},
        {label: 'Friends', icon: <Users size={22} className="text-grey3 mb-1"/>, path: '/add-friends'},
        {label: 'Requests', icon: <Bell size={22} className="text-grey3 mb-1"/>, path: '/requests'},
        {label: 'Post', icon: <Plus size={22} className="text-grey3 mb-1"/>, path: '/post'}
    ];

    const modelLinks = [
        {label: 'Settings', icon: <Settings size={22} className="text-grey3 mb-1"/>, path: '/settings/edit-profile'},
        {label: 'Profile', icon: <User size={22} className="text-grey3 mb-1"/>, path: '/profile'},
        {label: 'Log Out', icon: <Power size={22} className="text-error3 mb-1"/>, path: '/sign-in'},
    ];

    const pathname = usePathname();
    const showLeftSide = pathname !== '/';

    useEffect(()=>{
        function closeModelHandler(e: MouseEvent){
            if (closeModel.current && !closeModel.current.contains(e.target as Node)){
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', closeModelHandler);
        return () => document.removeEventListener('mousedown', closeModelHandler);
    }, []);



    console.log(isModelOpen)
    if (!showLeftSide) return null;

    return(
        <aside className="fixed left-0 top-0 h-full max-w-[25%] w-full md:p-4 lg:p-10 border flex flex-col justify-between">
            <div className="flex flex-col gap-8">
                <div className="w-full flex items-center p-2 h-24">
                    <Logo />
                </div>
                <div className="flex flex-col gap-4">   
                    {navLinks.map(link =>{
                        if (link.label === 'Search') {
                            return(
                                <button key={link.label} onClick={() => setIsModelOpen(true)} className="flex items-center gap-3 py-3 px-6 w-full rounded-lg text-[1.2rem] text-grey1 hover:bg-primary6 transition-all text-left hover:cursor-pointer">
                                    {link.icon} <span className="truncate">{link.label}</span>
                                </button>
                            );
                        }else {
                            if (link.label === 'Post'){
                                return(
                                    <button key={link.label} onClick={() => setIsPostOpen(true)} className="flex items-center gap-3 py-3 px-6 w-full rounded-lg text-[1.2rem] text-grey1 hover:bg-primary6 transition-all text-left hover:cursor-pointer">
                                        {link.icon} <span className="truncate">{link.label}</span>
                                    </button>
                                )
                            }
                        }
                        const activeClass = pathname === link.path ?  'bg-primary2 font-semibold' :  'hover:bg-primary6 transition-all';
                        return(
                            <Link key={link.path} href={link.path} className={`flex items-center gap-3 py-3 px-6 w-full rounded-lg text-[1.2rem] text-grey1 ${activeClass}`}>
                                {link.icon} <span className="truncate">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            
            <div className="flex flex-col gap-1 relative" ref={closeModel}>
                {isOpen && (
                    <div className="absolute bottom-full mb-3 left-0 w-full rounded-lg bg-primary8 flex flex-col gap-3 shadow-2xl border border-primary3/40 animate-in fade-in p-2">
                        {modelLinks.map(link =>{
                            const activeClass = pathname === link.path ? 'bg-primary2 font-semibold' : 'hover:bg-primary6 transition-all';
                            return(
                                 <Link onClick={()=>setIsOpen(false)} key={link.path} href={link.path} className={`${link.path === '/sign-in' ? '!text-error3' : ''} text-grey1 text-[1.2rem] flex items-center gap-3 ${activeClass} py-3 px-6 rounded-lg`}>
                                    {link.icon} <span className="truncate">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
                <div className="flex items-center justify-between py-4 border border-primary5/40 p-3">
                    <ProfileIcon />
                    <Ellipsis size={22} className="text-grey3 cursor-pointer" onClick={() => setIsOpen(prev => !prev)} />
                </div>
            </div>
            {isModelOpen && <MainSearch closeModel={() =>setIsModelOpen(false)}/>}
            {isPostOpen && (
                <PostModel closeModel={() => setIsPostOpen(false)} />
            )}
        </aside>
    );
}