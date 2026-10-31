import AuthOverlay from "@/components/AuthComponents/AuthOverlay";
import SignInModel from "@/components/AuthComponents/SignInModel";

export default function SignIn(){
    return(
        <main className="flex min-h-dvh w-full justify-center items-center p-0 sm:p-6">
            <AuthOverlay/>
            <SignInModel/>
        </main> 
    )
}