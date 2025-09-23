import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import NoItems from "../common/NoItems";
import NameHeader from "./NameHeader";
import Chat from "./Chat";
import InputMessage from "./InputMessage";
import { useGetChatHistory } from "@/store/data/inbox/hooks";
import { chatMessageType } from "@/lib/interface-types";
import Cookies from "js-cookie";
import { useSocket } from "@/hooks/use-socket";

function Messages() {
  const [messageStore, setMessageStore] = React.useState<chatMessageType[]>([]);

  const token = Cookies.get("authToken");
  const { onNewMessage } = useSocket(token);

  const noMessages = false;
  const searchParams = useSearchParams();
  const userId = searchParams[0].get("userId") || undefined;

  useEffect(() => {
    setMessageStore([]);
  }, [userId]);
  //

  const chats = useGetChatHistory(userId);
  const messages = chats?.data?.data?.messages || [];
  const otherUserDetails = chats?.data?.data?.otherUserDetails;

  useEffect(() => {
    if (messages.length > 0) {
      setMessageStore(messages);
    }
  }, [messages]);

  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data?.fromUserId === userId) {
        setMessageStore((prevMessages) => [
          ...prevMessages,
          {
            id: data?.id,
            conversationId: "",
            isOtherUserMessage: true,
            message: data?.message,
            createdAt: data?.createdAt,
            hasRead: data?.hasRead,
          },
        ]);
      }
    };

    onNewMessage(handleNewMessage);
  }, [onNewMessage]);

  return (
    <div className="flex-grow flex h-[calc(100vh-3.5rem)]  ">
      {noMessages && <NoItems className="mt-[10rem]" />}

      {!noMessages && (
        <div className="flex-grow flex flex-col justify-between overflow-y-auto  px-4 border-rounded-md">
          <NameHeader
            name={otherUserDetails?.name}
            avatar={otherUserDetails?.avatar}
          />
          <Chat messages={messageStore} otherUserDetails={otherUserDetails} />
          <InputMessage />
        </div>
      )}
    </div>
  );
}

export default Messages;
