'use client'

import { Bell, Ellipsis, MessageCircle, Plus, Power, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ProfileIcon from "./ProfileIcon";
import { useEffect, useRef, useState } from "react";
import PostModel from "./PostComponents/PostModel";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { userInfos } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import MessagesModel from "./MessagesComponents/MessagesModel";
import { getAllMessagesInboxes, messageInboxesValue, newMessageValue } from "@/lib/services/message";
import { Chat } from "@prisma/client";
import { useSocket } from "@/hooks/useSocket";
import { socket } from "@/lib/socket";
import NotificationCircle from "./NotificationCircle";
import { useNotificationStore } from "@/lib/store/useNotificationStore";

interface LeftSideProps {
    userInfos: userInfos | null
    requestsCount: number
    messagesCount: number
}

export default function LeftSide({ userInfos, requestsCount,messagesCount }: LeftSideProps) {
    useSocket();

    const { setUserInfos, cachedUserInfos } = useUserStore();
    const {increaseTotal} = useNotificationStore();
    const [isInboxesLoading,setIsInboxesLoading] = useState<boolean>(false);
    const { username } = cachedUserInfos;
    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = useState(false);
    const [isMessageModelOpen, setIsMessageModelOpen] = useState(false);
    const [isPostOpen, setIsPostOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [inboxes, setInboxes] = useState<messageInboxesValue[]>([]);

    const closeModel = useRef<HTMLDivElement | null>(null);

    const showLeftSide = pathname !== "/";
    const isMessagesPage = pathname.startsWith("/messages");
    const isMessagesRoot = pathname === "/messages";
    const isChatPage = isMessagesPage && !isMessagesRoot;

    const expanded = !isSmall && (!isChatPage || isHovered);
    const sidebarWidth = expanded ? 256 : 68;

    const showPanel =
        showLeftSide &&
        isMessagesPage &&
        (isSmall ? isMessagesRoot : isMessageModelOpen);



    useEffect(() => {
        if (userInfos) {
            setUserInfos(userInfos);
        }
    }, [userInfos, setUserInfos]);

    useEffect(() => {
        setIsMessageModelOpen(isMessagesPage);
    }, [isMessagesPage]);

    useEffect(()=>{
        const fetchNewMessage = (newMessage: newMessageValue) => {
            setInboxes(prev => {
                return prev.map(inbox => (
                    inbox.id === newMessage.chatId
                        ? {
                            ...inbox,
                            messages: [{
                                id: newMessage.id,
                                chatId: newMessage.chatId,
                                content: newMessage.content,
                                readAt: newMessage.readAt,
                                createdAt: newMessage.createdAt,
                                sender: {
                                    id: newMessage.senderId,
                                    username: newMessage.sender.username,
                                    image: newMessage.sender.image ?? '/callbackAvatar.webp'
                                
                                }
                            }]
                        }
                        : inbox
                ));
            });
        };
        socket.on("message:new",fetchNewMessage);
        return  () => {
            socket.off("message:new",fetchNewMessage)
        }
    },[])

    useEffect(()=>{
        const handleNewInboxMessage = (newMessage:newMessageValue) =>{
            const isUnread = newMessage.readAt === undefined;
            const hasUnreadMessages = inboxes.some(inbox => inbox.messages.some(message => message.readAt === undefined));
            if (!hasUnreadMessages && isUnread){
                increaseTotal('messages');
            }
            setInboxes(prev => {
                const updatedInbox = prev.find(inbox => inbox.id === newMessage.chatId);
                if (!updatedInbox) return prev;
                const updated = {
                    ...updatedInbox,
                    messages: [
                        {
                         id: newMessage.id,
                        chatId: newMessage.chatId,
                        content: newMessage.content,
                        readAt: newMessage.readAt ?? null,
                        createdAt: newMessage.createdAt,
                        sender: {
                            id: newMessage.senderId,
                            username: newMessage.sender.username,
                            image: newMessage.sender.image || '/callbackAvatar.webp'
                        }   
                        }
                    ]
                };
                return [
                    updated,
                    ...prev.filter(inbox => inbox.id !== newMessage.chatId)
                ]
            })
        }
        socket.on("inbox:message:new",handleNewInboxMessage);
        return () =>{
            socket.off("inbox:message:new",handleNewInboxMessage);
        }
    },[])

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 1280px)");

        const update = () => setIsSmall(mq.matches);

        update();
        mq.addEventListener("change", update);

        return () => mq.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        const body = document.body;

        body.style.transition = "padding-left 300ms ease-in-out";

        if (!showLeftSide || isSmall) {
            body.style.paddingLeft = "";
        } else {
            const extraSidebarWidth = sidebarWidth - 68;
            const panelWidth = showPanel ? 360 : 0;

            body.style.paddingLeft = `${extraSidebarWidth + panelWidth}px`;
        }

        return () => {
            body.style.paddingLeft = "";
            body.style.transition = "";
        };
    }, [showLeftSide, isSmall, sidebarWidth, showPanel]);

    useEffect(() => {
        const fetchInboxes = async () => {
            try {
                setIsInboxesLoading(true);
                const res = await getAllMessagesInboxes();

                if (!res.success || !res.messagesInboxes) {
                    toast.error("Failed to fetch messages inboxes");
                    return;
                }

                setInboxes(res.messagesInboxes);
            } catch {
                toast.error("Something went wrong, please try again.");
            }
            finally{
                setIsInboxesLoading(false);
            }
        };

        fetchInboxes();
    }, [pathname]);

    const navLinks = [
        { label: "Chats", icon: <MessageCircle size={20} className="shrink-0" />, path: "/messages" },
        { label: "Friends", icon: <Users size={20} className="shrink-0" />, path: "/add-friends" },
        { label: "Requests", icon: <Bell size={20} className="shrink-0" />, path: "/requests" },
        { label: "Post", icon: <Plus size={20} className="shrink-0" />, path: "/post" }
    ];

    const modelLinks = [
        { label: "Settings", icon: <Settings size={20} className="shrink-0" />, path: "/settings/edit-profile" },
        { label: "Profile", icon: <User size={20} className="shrink-0" />, path: `/profile/${username}` },
        { label: "Log Out", icon: <Power size={20} className="shrink-0" />, path: "/sign-in" },
    ];

    useEffect(() => {
        function closeModelHandler(e: MouseEvent) {
            if (closeModel.current && !closeModel.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", closeModelHandler);

        return () => document.removeEventListener("mousedown", closeModelHandler);
    }, []);

    const handleLogout = async () => {
        try {
            await authClient.signOut();
        } catch {
            toast.error("Something went wrong");
        }
    };

    if (!showLeftSide) return null;

    return (
        <>
            <aside
                onMouseEnter={() => {
                    if (!isSmall) setIsHovered(true);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsOpen(false);
                }}
                className={`fixed left-0 top-0 z-40 flex h-dvh flex-col justify-between overflow-visible border-r border-primary5/40 bg-primary7 transition-[width,padding] duration-300 ease-in-out ${
                    isSmall && isChatPage
                        ? "hidden"
                        : expanded
                            ? "w-64 p-4"
                            : "w-[68px] px-1.5 py-5"
                }`}
            >
                <div className="flex min-w-0 flex-col gap-6">
                    <div className={`flex h-14 w-full min-w-0 items-center overflow-hidden ${expanded ? "justify-start px-2" : "justify-center"}`}>
                        <Link
                            href="/"
                            aria-label="Nexio"
                            className={`flex h-9 min-w-0 shrink-0 items-center ${expanded ? "gap-3" : "w-9 justify-center"}`}
                        >
                            <div className="h-9 w-9 shrink-0 bg-current text-grey1 [mask-image:url('/chatLogo.svg')] [mask-size:contain] [mask-repeat:no-repeat]" />

                            <span className={`font-[family-name:var(--font-alatsi)] whitespace-nowrap text-[1.8rem] text-grey1 transition-opacity duration-200 ${expanded ? "opacity-100" : "hidden opacity-0"}`}>
                                Nexio
                            </span>
                        </Link>
                    </div>

                    <div className="flex min-w-0 flex-col gap-2">
                        {navLinks.map(link => {
                            const isActive = pathname === link.path;

                            const activeClass = isActive
                                ? "bg-primary2 text-grey1 shadow-sm"
                                : "text-grey3 hover:bg-primary6 hover:text-grey1";

                            const itemClass = `group relative flex h-11 w-full min-w-0 cursor-pointer items-center overflow-hidden rounded-xl transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                                expanded ? "gap-3 px-4" : "justify-center px-0"
                            } ${activeClass}`;

                            if (link.label === "Post") {
                                return (
                                    <button
                                        key={link.label}
                                        type="button"
                                        onClick={() => setIsPostOpen(true)}
                                        title={!expanded ? link.label : undefined}
                                        className={itemClass}
                                    >
                                        {link.icon}
                                        <span className={`whitespace-nowrap ${expanded ? "block" : "hidden"}`}>
                                            {link.label}
                                        </span>
                                    </button>
                                );
                            }

                            if (link.label === "Chats") {
                                return (
                                    <button
                                        key={link.label}
                                        type="button"
                                        onClick={() => {
                                            setIsMessageModelOpen(true);
                                            setIsOpen(false);
                                            router.push("/messages");
                                        }}
                                        title={!expanded ? link.label : undefined}
                                        aria-expanded={showPanel}
                                        className={`group relative flex h-11 w-full min-w-0 cursor-pointer items-center overflow-hidden rounded-xl transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                                            expanded ? "gap-3 px-4" : "justify-center px-0"
                                        } ${
                                            showPanel || isActive
                                                ? "bg-primary2 text-grey1 shadow-sm"
                                                : "text-grey3 hover:bg-primary6 hover:text-grey1"
                                        }`}
                                    >
                                        <span className="relative flex shrink-0 items-center justify-center">
                                            {link.icon}
                                            <span className="absolute -right-2 -top-1">
                                                <NotificationCircle value={messagesCount} />
                                            </span>
                                        </span>
                                        <span className={`whitespace-nowrap ${expanded ? "block" : "hidden"}`}>
                                            {link.label}
                                        </span>
                                    </button>
                                );
                            }

                            return (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    title={!expanded ? link.label : undefined}
                                    className={itemClass}
                                >
                                    {link.label === "Requests" ? (
                                        <span className="relative flex shrink-0 items-center justify-center">
                                            {link.icon}
                                            <span className="absolute -right-2 -top-1">
                                                <NotificationCircle value={requestsCount} />
                                            </span>
                                        </span>
                                    ) : link.icon}
                                    <span className={`whitespace-nowrap ${expanded ? "block" : "hidden"}`}>
                                        {link.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="relative min-w-0" ref={closeModel}>
                    {isOpen && (
                        <div className={`absolute bottom-full z-50 mb-3 rounded-xl border border-primary5/50 bg-primary8 p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                            expanded ? "left-0 w-full" : "left-[56px] w-56"
                        }`}>
                            {modelLinks.map(link => {
                                const activeClass = pathname === link.path
                                    ? "bg-primary2 font-semibold"
                                    : "hover:bg-primary6";

                                return (
                                    <Link
                                        onClick={() => {
                                            setIsOpen(false);
                                            if (link.path === "/sign-in") handleLogout();
                                        }}
                                        key={link.path}
                                        href={link.path}
                                        className={`${link.path === "/sign-in" ? "!text-error3" : "text-grey1"} flex h-11 items-center gap-3 rounded-lg px-3 transition-colors duration-200 ${activeClass}`}
                                    >
                                        {link.icon}
                                        <span className="whitespace-nowrap">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className={`relative flex h-12 w-full min-w-0 items-center rounded-xl border border-primary5/40 transition-colors duration-200 hover:bg-primary6/60 ${
                        expanded ? "justify-between px-2" : "justify-center px-0"
                    }`}>
                        <ProfileIcon expanded={expanded} />

                        {expanded && (
                            <button
                                type="button"
                                title="More"
                                aria-label="More options"
                                onClick={() => setIsOpen(prev => !prev)}
                                className="shrink-0 rounded-lg p-2 text-grey3 transition-colors duration-200 hover:bg-primary5 hover:text-grey1"
                            >
                                <Ellipsis size={20} />
                            </button>
                        )}

                        {!expanded && (
                            <button
                                type="button"
                                title="More"
                                aria-label="More options"
                                onClick={() => setIsOpen(prev => !prev)}
                                className="absolute inset-0 z-10 cursor-pointer rounded-xl"
                            />
                        )}
                    </div>
                </div>
            </aside>

            {isPostOpen && (
                <PostModel closeModel={() => setIsPostOpen(false)} />
            )}

            {showPanel && (
                <div
                    style={{
                        left: isSmall ? 68 : sidebarWidth,
                        width: isSmall ? "calc(100vw - 68px)" : `min(360px, calc(100vw - ${sidebarWidth}px))`
                    }}
                    className="fixed bottom-0 top-0 z-30 overflow-hidden border-r border-primary5/50 bg-primary7 shadow-2xl transition-[left,width] duration-300 ease-in-out"
                >
                    <MessagesModel
                        onClose={() => setIsMessageModelOpen(false)}
                        inboxes={inboxes}
                        isInboxesLoading={isInboxesLoading}
                        onDelete={(targetId: Chat["id"]) =>
                            setInboxes(prev => prev.filter(item => item.id !== targetId))
                        }
                        onUpdate={(targetId:Chat['id']) => setInboxes(prev => prev.map(item => item.id === targetId ? {...item,isUnread:false} : item))}
                    />
                </div>
            )}
        </>
    );
}