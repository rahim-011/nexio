import VerifyOtpCode from "./VerifyOtpCode";

export default function VerifyEmailModel({email}:{email:string}){
    return(
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl flex flex-col gap-6 bg-primary9 p-8 rounded-2xl shadow-2xl z-[52]">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-grey1">Verify your email address</h2>
                <p className="text-grey4 text-base flex flex-wrap items-center gap-1">
                    Please enter the 6-digits code sent to <span className="text-unique3 font-semibold">{email}</span>
                </p>
            </div>
            <VerifyOtpCode/>
        </div>
    )
}