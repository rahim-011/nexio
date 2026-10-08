
import AuthOverlay from "@/components/AuthComponents/AuthOverlay";
import SignUpModel from "@/components/AuthComponents/SignUpModel";




export default function SignUp(){
    return(
        <main className="flex p-6 justify-center items-center min-h-screen">
            <AuthOverlay/>
            <SignUpModel/>
        </main> 
    )
}