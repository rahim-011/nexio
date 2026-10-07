


import { Image, SquarePlay } from "lucide-react";

export default function IconStack() {
  return (
    <div className="relative h-16 w-20">
      <SquarePlay
        strokeWidth={1.5}
        className="absolute right-0 top-3 size-10 rotate-12 text-white"
      />
      <div className="absolute left-1 top-0 -rotate-12 rounded-lg bg-[#0b1a33] p-0.5">
        <Image strokeWidth={1.5} className="size-10 text-white" />
      </div>
    </div>
  );
}