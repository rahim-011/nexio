import MessageSubMain from "@/components/MessagesComponents/MessageSubMain";
import MessageSubTitle from "@/components/MessagesComponents/MessageSubTitle";





export default function ChatMain(){
    return(
        <main className="flex flex-col">
            <MessageSubTitle/>
            <MessageSubMain/>
        </main>
    )
}