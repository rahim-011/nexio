import { MessageCircle } from "lucide-react";

export default function EmptyComments() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary5 bg-primary9">
        <MessageCircle className="h-6 w-6 text-grey2" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-grey1">
          No comments yet
        </h3>
        <p className="max-w-[240px] text-xs leading-5 text-grey2">
          Be the first to share your thoughts on this post.
        </p>
      </div>
    </div>
  );
}