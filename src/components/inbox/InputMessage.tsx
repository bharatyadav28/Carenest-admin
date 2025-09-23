import { useEffect, useState } from "react";
import { LuSend as SendIcon } from "react-icons/lu";
import { IoIosAttach as AttachmentIcon } from "react-icons/io";

import { Input } from "@/components/ui/input";

import { useSocket } from "@/hooks/use-socket";
import Cookies from "js-cookie";

function InputMessage() {
  const [message, setMessage] = useState("");

  const token = Cookies.get("authToken");

  const { sendMessage, onNewMessage } = useSocket(token);
  const handleSendMessage = () => {
    // Implement send message logic here

    sendMessage("jbv0cIB24Rkj4L5vSXjSU", message);
    setMessage("");
  };

  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      console.log("New message received:", msg);
    };

    onNewMessage(handleNewMessage);
  }, [onNewMessage]);

  return (
    <div className="flex items-center rounded-lg px-4 py-1 bg-[#F7F7F3]  ">
      <div className="flex grow-1 gap-4 items-center">
        <button>
          <AttachmentIcon size={21} className="text-[var(--cool-gray)] " />
        </button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="ps-0 border-none focus-visible:ring-0  text-[#000]"
          placeholder="Write here..."
        />
      </div>

      <button onClick={handleSendMessage}>
        <SendIcon size={18} className="text-[#000] " />
      </button>
    </div>
  );
}

export default InputMessage;
