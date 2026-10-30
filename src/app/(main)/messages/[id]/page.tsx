import MessageSub from "@/components/MessagesComponents/MessageSub";
import MessageSubTitle from "@/components/MessagesComponents/MessageSubTitle";
import { getReceiverChatInfos } from "@/lib/services/message";

export default async function ChatMain({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const chatId = (await params).id;
    const receiverInfosRes = await getReceiverChatInfos(chatId);

    if (!receiverInfosRes.success || !receiverInfosRes.receiverInfos) {
        return null;
    }

    return (
        <main className="flex h-dvh min-h-0 flex-col overflow-hidden">
            <MessageSubTitle receiverInfos={receiverInfosRes.receiverInfos} />
            <MessageSub chatId={chatId} currentUserId={receiverInfosRes.receiverInfos.currentUserId}/>
        </main>
    );
}