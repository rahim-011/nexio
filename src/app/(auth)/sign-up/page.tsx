import AuthOverlay from "@/components/AuthComponents/AuthOverlay";
import SignUpModel from "@/components/AuthComponents/SignUpModel";

export default function SignUp(){
    return(
        <main className="flex min-h-dvh w-full justify-center items-center p-0 sm:p-6">
            <AuthOverlay/>
            <SignUpModel/>
        </main> 
    )
}