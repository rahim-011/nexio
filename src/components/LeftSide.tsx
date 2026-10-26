
'use client'

import { Bell, Ellipsis, MessageCircle, Plus, Power, Search, Settings, User, Users } from "lucide-react";
import { alatsi } from "@/lib/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileIcon from "./ProfileIcon";
import { useEffect, useRef, useState } from "react";
import MainSearch from "./MainSearch";
import PostModel from "./PostComponents/PostModel";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { userInfos } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";

interface LeftSideProps {
    userInfos: userInfos | null
}

export default function LeftSide({ userInfos }: LeftSideProps) {
    const { setUserInfos, cachedUserInfos } = useUserStore();
    const { username } = cachedUserInfos;

    useEffect(() => {
        if (userInfos) {
            setUserInfos(userInfos);
        }
    }, [userInfos, setUserInfos]);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const [isPostOpen, setIsPostOpen] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const closeModel = useRef<HTMLDivElement | null>(null);

    const navLinks = [
        { label: 'Search', icon: <Search size={22} className="shrink-0 text-grey3" />, path: '/search' },
        { label: 'Chats', icon: <MessageCircle size={22} className="shrink-0 text-grey3" />, path: '/messages' },
        { label: 'Friends', icon: <Users size={22} className="shrink-0 text-grey3" />, path: '/add-friends' },
        { label: 'Requests', icon: <Bell size={22} className="shrink-0 text-grey3" />, path: '/requests' },
        { label: 'Post', icon: <Plus size={22} className="shrink-0 text-grey3" />, path: '/post' }
    ];

    const modelLinks = [
        { label: 'Settings', icon: <Settings size={22} className="shrink-0 text-grey3" />, path: '/settings/edit-profile' },
        { label: 'Profile', icon: <User size={22} className="shrink-0 text-grey3" />, path: `/profile/${username}` },
        { label: 'Log Out', icon: <Power size={22} className="shrink-0 text-error3" />, path: '/sign-in' },
    ];

    const pathname = usePathname();
    const showLeftSide = pathname !== '/';

    useEffect(() => {
        function closeModelHandler(e: MouseEvent) {
            if (closeModel.current && !closeModel.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', closeModelHandler);
        return () => document.removeEventListener('mousedown', closeModelHandler);
    }, []);

    const handleLogout = async () => {
        try {
            await authClient.signOut();
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (!showLeftSide) return null;

    return (
        <aside
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsOpen(false);
            }}
            className={`peer fixed left-0 top-0 z-40 flex h-screen flex-col justify-between overflow-visible border-r border-primary5/40 bg-primary7 transition-[width,padding] duration-300 ease-in-out ${isHovered ? 'w-64 p-4' : 'w-[76px] px-2 py-6'}`}
        >
            <div className="flex min-w-0 flex-col gap-8">
                <div className={`flex h-16 w-full min-w-0 items-center overflow-hidden ${isHovered ? 'justify-start px-2' : 'justify-center'}`}>
                    <Link
                        href="/"
                        aria-label="Nexio"
                        className={`flex h-10 min-w-0 shrink-0 items-center ${isHovered ? 'gap-3' : 'w-10 justify-center'}`}
                    >
                        <div className="h-10 w-10 shrink-0 bg-current text-grey1 [mask-image:url('/chatLogo.svg')] [mask-size:contain] [mask-repeat:no-repeat]" />
                        <span className={`${alatsi.className} whitespace-nowrap text-[1.8rem] text-grey1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'hidden opacity-0'}`}>
                            Nexio
                        </span>
                    </Link>
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                    {navLinks.map(link => {
                        const activeClass = pathname === link.path
                            ? 'bg-primary2 font-semibold'
                            : 'hover:bg-primary6';

                        const itemClass = `flex h-12 w-full min-w-0 items-center overflow-hidden rounded-lg text-grey1 transition-colors duration-200 ${isHovered ? 'gap-3 px-4' : 'justify-center px-0'} ${activeClass}`;

                        if (link.label === 'Search') {
                            return (
                                <button
                                    key={link.label}
                                    type="button"
                                    onClick={() => setIsModelOpen(true)}
                                    title={!isHovered ? link.label : undefined}
                                    className={itemClass}
                                >
                                    {link.icon}
                                    <span className={`whitespace-nowrap ${isHovered ? 'block' : 'hidden'}`}>
                                        {link.label}
                                    </span>
                                </button>
                            );
                        }

                        if (link.label === 'Post') {
                            return (
                                <button
                                    key={link.label}
                                    type="button"
                                    onClick={() => setIsPostOpen(true)}
                                    title={!isHovered ? link.label : undefined}
                                    className={itemClass}
                                >
                                    {link.icon}
                                    <span className={`whitespace-nowrap ${isHovered ? 'block' : 'hidden'}`}>
                                        {link.label}
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                title={!isHovered ? link.label : undefined}
                                className={itemClass}
                            >
                                {link.icon}
                                <span className={`whitespace-nowrap ${isHovered ? 'block' : 'hidden'}`}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="relative min-w-0" ref={closeModel}>
                {isOpen && (
                    <div className={`absolute bottom-full z-50 mb-3 rounded-lg border border-primary3/40 bg-primary8 p-2 shadow-2xl animate-in fade-in ${isHovered ? 'left-0 w-full' : 'left-[60px] w-56'}`}>
                        {modelLinks.map(link => {
                            const activeClass = pathname === link.path
                                ? 'bg-primary2 font-semibold'
                                : 'transition-colors hover:bg-primary6';

                            return (
                                <Link
                                    onClick={() => {
                                        setIsOpen(false);
                                        if (link.path === '/sign-in') handleLogout();
                                    }}
                                    key={link.path}
                                    href={link.path}
                                    className={`${link.path === '/sign-in' ? '!text-error3' : ''} flex h-12 items-center gap-3 rounded-lg px-4 text-grey1 ${activeClass}`}
                                >
                                    {link.icon}
                                    <span className="whitespace-nowrap">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className={`relative flex h-14 w-full min-w-0 items-center rounded-lg border border-primary5/40 ${isHovered ? 'justify-between px-2' : 'justify-center px-0'}`}>
                    <ProfileIcon expanded={isHovered} />

                    {isHovered && (
                        <button
                            type="button"
                            title="More"
                            aria-label="More options"
                            onClick={() => setIsOpen(prev => !prev)}
                            className="shrink-0 rounded-lg p-2 hover:bg-primary6"
                        >
                            <Ellipsis size={22} className="text-grey3" />
                        </button>
                    )}

                    {!isHovered && (
                        <button
                            type="button"
                            title="More"
                            aria-label="More options"
                            onClick={() => setIsOpen(prev => !prev)}
                            className="absolute inset-0 z-10 cursor-pointer"
                        />
                    )}
                </div>
            </div>

            {isModelOpen && (
                <MainSearch closeModel={() => setIsModelOpen(false)} />
            )}

            {isPostOpen && (
                <PostModel closeModel={() => setIsPostOpen(false)} />
            )}
        </aside>
    );
}
