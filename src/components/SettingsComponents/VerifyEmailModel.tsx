import { ResetActions } from "@/lib/types";
import { EditEmailValue } from "./EditEmailForm";
import VerifyOtpCode from "./VerifyOtpCode";
import { X } from "lucide-react";

interface VerifyEmailProps {
    newEmail: EditEmailValue["email"];
    onClose: () => void;
    action: ResetActions
}

export default function VerifyEmailModel({ onClose, newEmail,action }: VerifyEmailProps) {
    return (
        <div className="fixed left-1/2 top-1/2 z-[52] flex w-[90%] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 rounded-2xl bg-primary9 p-8 shadow-2xl">
            <button
                type="button"
                onClick={onClose}
                aria-label="Close verification modal"
                className="absolute right-4 top-4 rounded-lg p-1.5 text-grey3 transition-colors hover:bg-primary5 hover:text-grey1"
            >
                <X size={22} />
            </button>

            <div className="flex flex-col gap-2 pr-6">
                <h2 className="text-3xl font-bold text-grey1">
                    Verify your Email address
                </h2>
                <p className="flex flex-wrap items-center gap-1 text-base text-grey4">
                    Please enter the 6-digits code sent to
                    <span className="font-semibold text-unique3">{newEmail}</span>
                </p>
            </div>

            <VerifyOtpCode newEmail={newEmail} onClose={onClose} action={action}/>
        </div>
    );
}