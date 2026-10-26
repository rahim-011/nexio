import { Check } from "lucide-react";

interface MessageBubbleProps {
    message: string;
    time: string;
    isMine: boolean;
}

export default function MessageBubble({
    message,
    time,
    isMine,
}: MessageBubbleProps) {
    return (
        <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] min-w-0 rounded-2xl px-4 pt-3 pb-2 shadow-sm ${
                    isMine
                        ? "rounded-br-md bg-[#2563EB] text-white"
                        : "rounded-bl-md bg-[#252B36] text-[#F1F5F9]"
                }`}
            >
                <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
                    {message}
                </p>
                <div className="mt-1.5 flex items-center justify-end gap-1.5">
                    <span
                        className={`text-xs ${
                            isMine ? "text-blue-100/90" : "text-slate-400"
                        }`}
                    >
                        {time}
                    </span>
                    {isMine && (
                        <Check
                            size={16}
                            strokeWidth={2.5}
                            className="text-green-400"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}