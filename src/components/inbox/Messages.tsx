import  { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import NameHeader from "./NameHeader";
import Chat from "./Chat";
import InputMessage from "./InputMessage";
import { useGetChatHistory } from "@/store/data/inbox/hooks";
import { chatMessageType } from "@/lib/interface-types";
import Cookies from "js-cookie";
import { useSocket } from "@/hooks/use-socket";

function Messages() {
  const [messageStore, setMessageStore] = useState<chatMessageType[]>([]);

  const token = Cookies.get("authToken");
  const { onNewMessage } = useSocket(token);

  const searchParams = useSearchParams();
  const userId = searchParams[0].get("userId") || undefined;

  // Clear messages when user changes
  useEffect(() => {
    setMessageStore([]);
  }, [userId]);

  // Fetch chat history
  const chats = useGetChatHistory(userId);
  const messages = chats?.data?.data?.messages || [];
  const otherUserDetails = chats?.data?.data?.otherUserDetails;

  // Merge fetched messages safely
  useEffect(() => {
    if (messages.length > 0) {
      setMessageStore((prevMessages) => {
        const newMessages = messages.filter(
          (msg) => !prevMessages.find((m) => m.id === msg.id)
        );
        return [...prevMessages, ...newMessages];
      });
    }
  }, [messages]);

  // Handle incoming socket messages
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (!data) return;

      if (data.fromUserId === userId || data.toUserId === userId) {
        setMessageStore((prevMessages) => {
          // Prevent duplicate messages
          if (prevMessages.find((msg) => msg.id === data.id)) return prevMessages;

          return [
            ...prevMessages,
            {
              id: data?.id || Date.now().toString(),
              conversationId: data?.conversationId || "",
              isOtherUserMessage: data?.fromUserId === userId,
              message: data?.message,
              createdAt: data?.createdAt || new Date().toISOString(),
              hasRead: data?.hasRead ?? false,
            },
          ];
        });
      }
    };

    onNewMessage(handleNewMessage);
  }, [onNewMessage, userId]);

  return (
    <div className="flex-grow flex h-[calc(100vh-3.5rem)]">
      <div className="flex-grow flex flex-col justify-between overflow-y-auto px-4 border-rounded-md">
        <NameHeader
          name={otherUserDetails?.name || "New User"}
          avatar={otherUserDetails?.avatar}
        />

        <Chat messages={messageStore} otherUserDetails={otherUserDetails} />

        <InputMessage
          userId={userId}
          addMessage={(msg) =>
            setMessageStore((prev) => {
              if (prev.find((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            })
          }
        />
      </div>
    </div>
  );
}

export default Messages;
