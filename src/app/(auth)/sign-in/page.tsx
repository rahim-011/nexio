
import AuthOverlay from "@/components/AuthComponents/AuthOverlay";
import SignInModel from "@/components/AuthComponents/SignInModel";




export default function SignIn(){
    return(
        <main className="flex p-6 justify-center items-center min-h-screen">
            <AuthOverlay/>
            <SignInModel/>
        </main> 
    )
}