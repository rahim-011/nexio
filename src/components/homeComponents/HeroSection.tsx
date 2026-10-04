import Link from "next/link";

export default function HeroSection(){
    return(
        <div className="flex flex-col items-center text-center gap-6 max-w-[1098px] mx-auto px-4 lg:p-10 md:p-7 p-5 justify-center h-[600px]">
            <h1 className="text-8xl font-semibold tracking-tight bg-gradient-to-r from-[#072247] from-[0%] via-[#4F86C6] via-[36%] to-[#F8FAFC] to-[100%] bg-clip-text text-transparent leading-[1.1]">
                Conversations Made Simple.
            </h1>
            <p className="text-sm text-grey4 max-w-[500px]">
                Chat with the people who matter, share moments, and stay connected—all in one place.
            </p>
            <Link href="/messages" className="text-grey1 bg-primary5 px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:opacity-90">
                Get Started
            </Link>
        </div>
    )
}