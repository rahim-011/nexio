import Image from "next/image";

export default function MessageSubTitle() {
  return (
    <div className="h-20 w-full border-b border-primary5/50 bg-primary5 px-5">
      <div className="flex h-full items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <Image
            src="/userPfp.png"
            alt="John Colaf"
            fill
            sizes="48px"
            className="rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 h-3.5 w-3.5 translate-x-0.5 translate-y-0.5 rounded-full border-2 border-primary5 bg-green-400" />
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-grey1">
            John Colaf
          </span>
          <span className="text-xs font-medium text-green-500">
            Online
          </span>
        </div>
      </div>
    </div>
  );
}