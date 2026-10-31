"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clearSearch } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import AddFriend from "./FriendsComponents/AddFriend";
import { searchResults } from "@/lib/types";
import AddNewMessage from "./ChatComponents/AddNewMessage";
import { useChatStore } from "@/lib/store/chatStore";
import MainSearchResults from "./MainSearchResults";
import EmptySearchResult from "./EmptyCallbacks/EmptySearchResult";
import { FilteredFriendsValues } from "@/lib/services/friend";

interface SearchBarProps {
    searchType: searchResults;
    placeHolder: string;
    filtredFriends?: FilteredFriendsValues[];
}

export default function SearchBar({
    placeHolder,
    searchType,
    filtredFriends = []
}: SearchBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { clearCurrentMessage } = useChatStore();
    const dropDownRef = useRef<HTMLDivElement | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentSearch, setCurrentSearch] = useState(
        searchParams.get("q") || ""
    );

    useEffect(() => {
        const query = searchParams.get("q") || "";
        setCurrentSearch(query);
    }, [searchParams]);

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value.trim()) {
            params.set("q", value.trim());
        } else {
            params.delete("q");
        }

        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newUrl, { scroll: false });
    }, 150);

    useEffect(() => {
        function closeDropDown(e: MouseEvent) {
            if (
                dropDownRef.current &&
                !dropDownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                clearCurrentMessage();
            }
        }

        document.addEventListener("mousedown", closeDropDown);

        return () => document.removeEventListener("mousedown", closeDropDown);
    }, [clearCurrentMessage]);

    return (
        <div className="relative w-full min-w-0" ref={dropDownRef}>
            <div className="relative flex w-full min-w-0 items-center">
                <Search
                    size={20}
                    className="pointer-events-none absolute left-3.5 shrink-0 text-grey7 sm:left-4"
                />

                <input
                    value={currentSearch}
                    type="text"
                    placeholder={placeHolder}
                    className="w-full min-w-0 rounded-lg bg-grey1 py-2.5 pl-11 pr-10 text-sm text-grey7 outline-0 ring-0 placeholder:text-xs focus-within:ring-0 sm:py-3 sm:pl-12 sm:text-lg sm:placeholder:text-base"
                    onChange={(e) => {
                        setCurrentSearch(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    onClick={() => setIsOpen(true)}
                />

                {currentSearch && (
                    <X
                        size={20}
                        className="absolute right-3 cursor-pointer text-grey7 transition-colors hover:text-grey9 sm:right-4"
                        onClick={() => {
                            clearSearch(pathname, searchParams, router);
                        }}
                    />
                )}
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 z-48 mt-1 flex max-h-[calc(100dvh-14rem)] min-w-0 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain rounded-b-lg bg-primary8 p-2.5 shadow-2xl origin-top animate-in fade-in slide-in-from-top-2 duration-200 sm:max-h-[min(70dvh,32rem)] sm:p-3">
                    {searchType === "friend" ? (
                        <>
                            {filtredFriends.length === 0 ? (
                                <EmptySearchResult />
                            ) : (
                                filtredFriends.map((friendRes) => (
                                    <AddFriend
                                        friendRes={friendRes}
                                        key={friendRes.id}
                                    />
                                ))
                            )}
                        </>

                    ) : searchType === "chat" ? (
                        /**The key here is a dynamic value that will be changed soon into a key map where i can controll which field i am selecting */                        
                        <>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <AddNewMessage index={index} key={index} />
                            ))}
                        </>
                    ) : searchType === "all" ? (
                        <>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <MainSearchResults index={index} key={index} />
                            ))}
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}