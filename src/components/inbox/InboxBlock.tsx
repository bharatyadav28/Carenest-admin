import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MessageList from "./MessageList";
import Messages from "./Messages";
import CustomSheet from "@/components/common/CustomSheet";
import { useSocket } from "@/hooks/use-socket";
import Cookies from "js-cookie";

function InboxBlock() {
  const [openMessages, setOpenMessages] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const queryClient = useQueryClient();
  const { onNewMessage } = useSocket(Cookies.get("authToken"));

  useEffect(() => {
    const handleNewMessage = () => {
      // Show notification for new message
      setHasNewMessage(true);
      
  

      // Auto refresh chat list
      queryClient.invalidateQueries(["chats"]);
    };

    onNewMessage(handleNewMessage); 
  }, [onNewMessage, queryClient]);

  const handleOpenMessages = () => {
    setOpenMessages((prev) => !prev);
    setHasNewMessage(false);
  };

  return (
    <div className="grid grid-cols-12 gap-6 overflow-hidden bg-[#0f0f0f]">
      <div className={`col-start-1 md:col-end-6 col-end-13 card mr-1 bg-[#000] relative ${
        hasNewMessage ? 'animate-pulse' : ''
      }`}>
    
        <MessageList handleOpenMessages={handleOpenMessages} />
      </div>
      
      <div className="col-start-6 col-end-13 card md:flex flex-grow overflow-y-auto hidden bg-[#000] ml-1">
        <Messages />
      </div>

      <CustomSheet
        open={openMessages}
        handleOpen={handleOpenMessages}
        className="py-10"
      >
        <Messages />
      </CustomSheet>
    </div>
  );
}

export default InboxBlock;
