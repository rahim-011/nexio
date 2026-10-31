import EmptyRequests from "@/components/EmptyCallbacks/EmptyRequests";
import Request from "@/components/RequestComponents/Request";
import { getUserReceivedRequests } from "@/lib/services/request";
import type { ReceivedRequestsValues } from "@/lib/services/request";

export default async function Reqeusts() {
    const requestsResult = await getUserReceivedRequests();

    if (!requestsResult.success) {
        return null;
    }

    const receivedRequests: ReceivedRequestsValues[] =
        requestsResult.userReceivedRequests ?? [];

    return (
        <main className="flex h-full min-h-0 min-w-0 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4 lg:max-w-[75%]">
            <div className="flex shrink-0 min-w-0 flex-col gap-1">
                <h1 className="text-xl font-semibold text-grey1 sm:text-2xl lg:text-3xl">
                    Friend Requests
                </h1>

                <p className="break-words text-xs text-grey1 sm:text-sm">
                    Manage your incoming connections and pending requests.
                </p>
            </div>

            <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3 self-center overflow-y-auto overscroll-contain rounded-lg bg-primary9 p-2.5 sm:p-3">
                {receivedRequests.length === 0 ? (
                    <EmptyRequests />
                ) : (
                    receivedRequests.map((request) => (
                        <Request
                            username={request.username}
                            avatar={request.avatar}
                            key={request.requestId}
                            requestId={request.requestId}
                        />
                    ))
                )}
            </div>
        </main>
    );
}