import { useEffect, useState } from "react";
import { LuSend as SendIcon } from "react-icons/lu";
import { IoIosAttach as AttachmentIcon } from "react-icons/io";

import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/use-socket";
import Cookies from "js-cookie";
import { chatMessageType } from "@/lib/interface-types";

interface InputMessageProps {
  userId?: string;
  addMessage?: (msg: chatMessageType) => void;
}

function InputMessage({ userId, addMessage }: InputMessageProps) {
  const [message, setMessage] = useState("");

  const token = Cookies.get("authToken");
  const { sendMessage, onNewMessage } = useSocket(token);

  const handleSendMessage = () => {
    if (!userId || !message.trim()) return;

    const newMsg: chatMessageType = {
      id: Date.now().toString(), 
      conversationId: "",
      isOtherUserMessage: false, 
      message: message,
      createdAt: new Date().toISOString(),
      hasRead: true,
    };

    addMessage?.(newMsg);

   
    sendMessage(userId, message);

    setMessage(""); 
  };


  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      if (!msg || msg.fromUserId !== userId) return;

      const incomingMsg: chatMessageType = {
        id: msg?.id || Date.now().toString(),
        conversationId: msg?.conversationId || "",
        isOtherUserMessage: true,
        message: msg?.message,
        createdAt: msg?.createdAt || new Date().toISOString(),
        hasRead: msg?.hasRead ?? false,
      };

      addMessage?.(incomingMsg);
    };

    onNewMessage(handleNewMessage);
  }, [onNewMessage, userId, addMessage]);

  return (
    <div className="flex items-center rounded-lg px-4 py-1 bg-[#F7F7F3]">
      <div className="flex grow-1 gap-4 items-center">
        <button>
          <AttachmentIcon size={21} className="text-[var(--cool-gray)]" />
        </button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="ps-0 border-none focus-visible:ring-0 text-[#000]"
          placeholder="Write here..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
      </div>

      <button onClick={handleSendMessage}>
        <SendIcon size={18} className="text-[#000]" />
      </button>
    </div>
  );
}

export default InputMessage;
