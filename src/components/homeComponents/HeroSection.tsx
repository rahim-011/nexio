import Link from "next/link";

export default function HeroSection() {
    return (
        <div className="flex min-h-[600px] flex-col items-center justify-center gap-6 mx-auto max-w-[1098px] px-5 py-16 text-center sm:px-7 lg:px-10">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight bg-gradient-to-r from-[#072247] from-[0%] via-[#4F86C6] via-[36%] to-[#F8FAFC] to-[100%] bg-clip-text text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                Conversations Made Simple.
            </h1>

            <p className="max-w-[500px] text-sm text-grey4 sm:text-base">
                Chat with the people who matter, share moments, and stay connected—all in one place.
            </p>

            <Link
                href="/messages"
                className="rounded-lg bg-primary5 px-6 py-3 font-medium text-grey1 shadow-md transition-all hover:opacity-90"
            >
                Get Started
            </Link>
        </div>
    );
}