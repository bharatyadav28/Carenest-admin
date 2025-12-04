import { useRef, useEffect } from "react";
import DP from "../common/DP";
import user1ProfilePic from "@/assets/profilepic1.png";
import user2ProfilePic from "@/assets/profilepic2.png";
import { chatMessageType, otherUserDetailsType } from "@/lib/interface-types";
import { formatTo12Hour, formatDateForGrouping } from "@/lib/resuable-fns";
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

  // Group messages by date
  const groupMessagesByDate = () => {
    if (!messages || messages.length === 0) return {};

    const grouped: Record<string, chatMessageType[]> = {};
    
    messages.forEach(message => {
      const dateKey = formatDateForGrouping(message.createdAt);
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(message);
    });

    return grouped;
  };

  // Get date display label
  const getDateLabel = (dateString: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(dateString);
    
    // Format dates for comparison (YYYY-MM-DD)
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const messageDateStr = messageDate.toISOString().split('T')[0];
    
    if (messageDateStr === todayStr) {
      return "Today";
    } else if (messageDateStr === yesterdayStr) {
      return "Yesterday";
    } else {
      // Format date as "Month Day, Year" (e.g., "January 15, 2024")
      return messageDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const groupedMessages = groupMessagesByDate();
  const dateKeys = Object.keys(groupedMessages).sort();

  return (
    <div
      className="flex flex-col flex-grow h-full overflow-y-auto hide-scrollbar gap-8 pb-8 pt-6"
      ref={containerRef}
    >
      {dateKeys.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No messages yet
        </div>
      ) : (
        dateKeys.map((dateKey) => (
          <div key={dateKey} className="space-y-6">
            {/* Date separator */}
            <div className="flex items-center justify-center">
              <div className="self-center bg-[var(--light-gray)] text-[#667085] rounded-full text-sm p-2 px-3">
                {getDateLabel(dateKey)}
              </div>
            </div>
            
            {/* Messages for this date */}
            <div className="flex flex-col gap-6">
              {groupedMessages[dateKey].map((message) => {
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
                        className={`rounded-2xl px-6 py-3 max-w-[21rem] break-words ${
                          isUser1 ? "bg-[#F8F9FA]" : "bg-[#233D4D33] text-white"
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
        ))
      )}
    </div>
  );
};

export default Chat;