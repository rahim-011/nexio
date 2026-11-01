import React from "react";
import NavBar from "@/components/NavBar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";




export default async function MarketingLayout({children}:Readonly<{children:React.ReactNode}>){
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const userId = session?.user.id;
    return (
        <>
            <NavBar userId={userId}/>
            <main>
                {children}
            </main>
        </>
    );
}