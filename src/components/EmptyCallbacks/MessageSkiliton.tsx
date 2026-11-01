export default function MessageSkeleton() {
    return (
        <div className="flex w-full animate-pulse flex-col gap-5 px-2 py-3 sm:p-4">
            <div className="flex justify-start">
                <div className="w-[65%] max-w-[420px] space-y-3 rounded-2xl rounded-bl-sm bg-primary7/50 p-4">
                    <div className="h-3 w-24 rounded-full bg-primary5/40" />
                    <div className="h-3 w-full rounded-full bg-primary5/40" />
                    <div className="h-3 w-3/5 rounded-full bg-primary5/40" />
                    <div className="ml-auto h-2 w-10 rounded-full bg-primary5/40" />
                </div>
            </div>

            <div className="flex justify-end">
                <div className="w-[70%] max-w-[420px] space-y-3 rounded-2xl rounded-br-sm bg-primary5/30 p-4">
                    <div className="h-3 w-full rounded-full bg-primary5/60" />
                    <div className="h-3 w-4/5 rounded-full bg-primary5/60" />
                    <div className="ml-auto h-2 w-10 rounded-full bg-primary5/60" />
                </div>
            </div>

            <div className="flex justify-start">
                <div className="w-[45%] max-w-[300px] space-y-3 rounded-2xl rounded-bl-sm bg-primary7/50 p-4">
                    <div className="h-3 w-full rounded-full bg-primary5/40" />
                    <div className="h-3 w-2/3 rounded-full bg-primary5/40" />
                    <div className="ml-auto h-2 w-10 rounded-full bg-primary5/40" />
                </div>
            </div>

            <div className="flex justify-end">
                <div className="w-[60%] max-w-[380px] space-y-3 rounded-2xl rounded-br-sm bg-primary5/30 p-4">
                    <div className="h-3 w-full rounded-full bg-primary5/60" />
                    <div className="h-3 w-3/4 rounded-full bg-primary5/60" />
                    <div className="h-3 w-2/5 rounded-full bg-primary5/60" />
                    <div className="ml-auto h-2 w-10 rounded-full bg-primary5/60" />
                </div>
            </div>

            <div className="flex justify-start">
                <div className="w-[55%] max-w-[350px] space-y-3 rounded-2xl rounded-bl-sm bg-primary7/50 p-4">
                    <div className="h-3 w-full rounded-full bg-primary5/40" />
                    <div className="h-3 w-1/2 rounded-full bg-primary5/40" />
                    <div className="ml-auto h-2 w-10 rounded-full bg-primary5/40" />
                </div>
            </div>
        </div>
    );
}