import { useUserStore } from "@/lib/store/userStore"




export default function MessagesModel(){
    const {cachedUserInfos} = useUserStore();
    const {username} = cachedUserInfos;
    return(
        <div className="flex flex-col">
            <div className="w-full px-4 py-6">
                <h2 className="text-grey1 font-semibold text-3xl">{username}</h2>
            </div>
            // here will be the chat component that holds the infos as props and ill map over them here .... ;
        </div>
    )
}