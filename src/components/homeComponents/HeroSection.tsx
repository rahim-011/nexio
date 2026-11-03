'use client'

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function HeroSection() {
    const router = useRouter();
    const {data:session} = authClient.useSession();
    return (
        <div className="flex min-h-[600px] flex-col items-center justify-center gap-6 mx-auto max-w-[1098px] px-5 py-16 text-center sm:px-7 lg:px-10">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight bg-gradient-to-r from-[#072247] from-[0%] via-[#4F86C6] via-[36%] to-[#F8FAFC] to-[100%] bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Conversations Made Simple.
            </h1>

            <p className="max-w-[500px] text-sm text-grey4 sm:text-base">
                Chat with the people who matter, share moments, and stay connected—all in one place.
            </p>

            <button
                className="rounded-lg bg-primary5 px-6 py-3 font-medium text-grey1 shadow-md transition-all hover:opacity-90 cursor-pointer"
                onClick={() => session ? router.push('/messages') : router.push('sign-in') }
            >
                Get Started
            </button>
        </div>
    );
}