export default function MessageInboxSkeleton() {
    return (
        <div className="flex w-full flex-col gap-2 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                    key={item}
                    className="flex w-full items-center gap-3 rounded-xl p-3"
                >
                    <div className="size-12 shrink-0 rounded-full bg-primary5/40" />

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                            <div className="h-3.5 w-28 rounded-full bg-primary5/50" />
                            <div className="h-2.5 w-10 rounded-full bg-primary5/30" />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="h-3 w-3/4 rounded-full bg-primary7/60" />
                            <div className="size-2.5 shrink-0 rounded-full bg-primary5/60" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}