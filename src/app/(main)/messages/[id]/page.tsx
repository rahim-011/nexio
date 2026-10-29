import MessageSubFooter from "@/components/MessagesComponents/MessageSubFooter";
import MessageSubMain from "@/components/MessagesComponents/MessageSubMain";
import MessageSubTitle from "@/components/MessagesComponents/MessageSubTitle";
import { getReceiverChatInfos } from "@/lib/services/message";

export default async function ChatMain({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const chatId = (await params).id;
  const receiverInfosRes = await getReceiverChatInfos(chatId);

  if (!receiverInfosRes.success) {
    return null;
  }

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden">
      <MessageSubTitle receiverInfos={receiverInfosRes.receiverInfos} />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <MessageSubMain />
      </div>

      <MessageSubFooter chatId={chatId}/>
    </main>
  );
}