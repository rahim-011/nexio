import React from "react";
import NavBar from "@/components/NavBar";




export default function MarketingLayout({children}:Readonly<{children:React.ReactNode}>){
    return (
        <>
            <NavBar />
            <main>
                {children}
            </main>
        </>
    );
}