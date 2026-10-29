import { receiverInfosValue } from "@/lib/services/message";
import Image from "next/image";

interface MessageSubTitleProps {
  receiverInfos: receiverInfosValue;
}

export default function MessageSubTitle({ receiverInfos }: MessageSubTitleProps) {
  if (!receiverInfos) {
    return null;
  }

  return (
    <div className="h-20 w-full border-b border-primary5/50 bg-primary5 px-5">
      <div className="flex h-full items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <Image
            src={receiverInfos.image || "/callbackAvatar.webp"}
            alt={`${receiverInfos.username} avatar`}
            fill
            sizes="48px"
            className="rounded-full object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 translate-x-0.5 translate-y-0.5 rounded-full border-2 border-primary5 ${
              receiverInfos.isOnline ? "bg-green-400" : "bg-gray-400"
            }`}
          />
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-grey1">
            {receiverInfos.username}
          </span>
          <span
            className={`text-xs font-medium ${
              receiverInfos.isOnline ? "text-green-500" : "text-gray-400"
            }`}
          >
            {receiverInfos.isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}