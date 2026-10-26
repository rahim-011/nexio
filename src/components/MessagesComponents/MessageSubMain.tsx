import MessageBubble from "./MessageBubble";





export default function MessageSubMain(){
    return(
        <div className="flex items-center justify-center">
            <MessageBubble isMine={true} time="12" message="Good morning"/>
        </div>
    )
}