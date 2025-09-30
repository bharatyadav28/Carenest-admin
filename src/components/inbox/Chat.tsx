import { useRef, useEffect } from "react";
import DP from "../common/DP";
import user1ProfilePic from "@/assets/profilepic1.png";
import user2ProfilePic from "@/assets/profilepic2.png";
import { chatMessageType, otherUserDetailsType } from "@/lib/interface-types";
import { formatTo12Hour } from "@/lib/resuable-fns";
import { cdnURL } from "@/lib/resuable-data";

interface props {
  messages?: chatMessageType[];
  otherUserDetails?: otherUserDetailsType;
}

const Chat = ({ messages, otherUserDetails }: props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

 
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex flex-col flex-grow h-full overflow-y-auto hide-scrollbar md:gap-2 gap-8 pb-8 pt-6"
      ref={containerRef}
    >
      <div className="self-center bg-[var(--light-gray)] text-[#667085] rounded-full text-sm p-2 px-3 mb-2">
        Today
      </div>
      <div className="flex flex-col gap-6">
        {messages?.map((message) => {
          const isUser1 = message.isOtherUserMessage;

          return (
            <div
              className={`flex gap-2 ${
                isUser1 ? "self-start" : "self-end flex-row-reverse"
              }`}
              key={message.id}
            >
              <div>
                <DP
                  url={
                    message.isOtherUserMessage && otherUserDetails?.avatar
                      ? `${cdnURL}${otherUserDetails?.avatar}`
                      : isUser1
                      ? user1ProfilePic
                      : user2ProfilePic
                  }
                  alt="user"
                  className="!w-10 !h-10"
                />
              </div>
              <div className="text-[#667085] text-sm flex flex-col">
                <div
                  className={`rounded-2xl px-6 py-3 max-w-[21rem] ${
                    isUser1 ? "bg-[#F8F9FA]" : "bg-[#233D4D33] text-black"
                  }`}
                >
                  {message.message}
                </div>
                <div className={isUser1 ? "ms-1" : "self-end mr-1"}>
                  {formatTo12Hour(message.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
