import EmptyRequests from "@/components/EmptyCallbacks/EmptyRequests";
import Request from "@/components/RequestComponents/Request";
import { getUserReceivedRequests } from "@/lib/services/request";
import type { ReceivedRequestsValues } from "@/lib/services/request";



export default async function Reqeusts(){
    const requestsResult = await getUserReceivedRequests();
    if (!requestsResult.success){
        return null
    }
    const receivedRequests:ReceivedRequestsValues[] = requestsResult.userReceivedRequests ?? [];
    return(
        <main className="flex flex-col gap-4 lg:max-w-[75%] p-4">
            <div className="flex flex-col gap-1 ">
                <h1 className="text-3xl text-grey1 font-semibold">Friend Requests</h1>
                <p className="text-grey1">Manage your incoming connections and pending requests.</p>
            </div>
            <div className="w-full  self-center flex flex-col gap-3 bg-primary9 p-3 rounded-lg min-h-120">
                {receivedRequests.length === 0 ? (<EmptyRequests/>) : (receivedRequests.map(request =>{
                    return(
                        <Request username={request.username} avatar={request.avatar} key={request.requestId} requestId={request.requestId}/>
                    )
                }))}
            </div>
        </main>
    )
}