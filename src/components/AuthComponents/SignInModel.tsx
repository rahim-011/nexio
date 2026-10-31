import Image from "next/image";
import SocialProviders from "./SocialProviders";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SignInForm from "./SignInForm";

export default function SignInModel() {
    return (
        <div className="relative mx-auto flex max-h-[95dvh] w-full max-w-[calc(100vw-1rem)] flex-col gap-3 overflow-y-auto rounded-lg bg-primary9 px-3 py-5 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 sm:max-w-lg sm:gap-4 sm:px-6 sm:py-8 md:max-w-xl lg:max-w-2xl">
            <Link
                href="/"
                aria-label="Back"
                className="absolute left-3 top-3 cursor-pointer text-grey1 transition-all hover:scale-105 sm:left-5 sm:top-5"
            >
                <ArrowLeft size={22} />
            </Link>

            <div className="flex flex-col items-center justify-center gap-3 px-1 pt-5 sm:gap-6 sm:px-5 sm:pt-4 md:gap-8 md:px-8">
                <div className="relative">
                    <Image
                        className="h-12 w-12 object-cover brightness-0 invert sm:h-16 sm:w-16"
                        alt="nexio logo"
                        width={65}
                        height={65}
                        src="/chatLogo.svg"
                    />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-xl font-semibold text-grey1 sm:text-3xl">
                        Welcome back
                    </h1>
                    <p className="text-xs text-grey4 sm:text-base">
                        Enter your details to access your account.
                    </p>
                </div>
            </div>

            <SignInForm/>

            <div className="mt-1 flex flex-col gap-3 sm:mt-2 sm:gap-4">
                <div className="flex w-full items-center gap-3 sm:gap-4">
                    <span className="h-px flex-1 bg-white/15"></span>
                    <span className="text-xs text-white sm:text-sm">or</span>
                    <span className="h-px flex-1 bg-white/15"></span>
                </div>

                <SocialProviders type="sign-in"/>

                <div className="flex flex-wrap items-center justify-center gap-x-2 text-center text-xs sm:text-base">
                    <span className="text-grey4">Dont't have an account?</span>
                    <Link
                        href="/sign-up"
                        className="cursor-pointer font-semibold text-error3 underline underline-offset-1 transition-all hover:brightness-110"
                    >
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}