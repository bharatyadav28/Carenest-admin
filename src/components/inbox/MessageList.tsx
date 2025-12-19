import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { cdnURL } from "@/lib/resuable-data";
import { Input } from "@/components/ui/input";
import NoItems from "@/components/common/NoItems";
import DP from "@/components/common/DP";
import ProfilePic from "@/assets/profilepic1.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetAllChats } from "@/store/data/inbox/hooks";
import { formatTo12Hour } from "@/lib/resuable-fns";
import { useSocket } from "@/hooks/use-socket";

interface Props {
  handleOpenMessages: () => void;
}

function MessageList({ handleOpenMessages }: Props) {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { onNewMessage } = useSocket(Cookies.get("authToken"));
  const navigate = useNavigate();

  const chats = useGetAllChats();
  const chatList = chats?.data?.data?.conversations || [];
  
  const noChats = chatList.length === 0;

  // Sort chats by latest message
  const sortedChats = [...chatList].sort((a, b) => {
    const dateA = new Date(a.lastMessage?.createdAt || 0);
    const dateB = new Date(b.lastMessage?.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Handle real-time updates
  useEffect(() => {
    const handleNewMessage = async (message: any) => {
      // Update chat list in cache
      queryClient.setQueryData(["chats"], (oldData: any) => {
        if (!oldData?.data) return oldData;

        const updatedConversations = oldData.data.conversations.map((chat: any) => {
          if (chat.toUser.id === message.fromUserId || chat.toUser.id === message.toUserId) {
            return {
              ...chat,
              lastMessage: {
                message: message.message,
                createdAt: message.createdAt
              },
              unReadCount: chat.unReadCount + 1
            };
          }
          return chat;
        });

        // Sort by latest message
        updatedConversations.sort((a: any, b: any) => {
          const dateA = new Date(a.lastMessage?.createdAt || 0);
          const dateB = new Date(b.lastMessage?.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            conversations: updatedConversations
          }
        };
      });
    };

    onNewMessage(handleNewMessage);
  }, [onNewMessage, queryClient]);

  useEffect(() => {
    if (!selectedUserId && sortedChats.length > 0) {
      setSelectedUserId(sortedChats[0].toUser.id);
    }
  }, [sortedChats, selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      navigate(`?userId=${selectedUserId}`);
    }
  }, [selectedUserId, navigate]);

  const handleClick = (userId: string) => {
    if (isMobile) handleOpenMessages();
    setSelectedUserId(userId);
  };

  // Filter chats by search
  const filteredChats = sortedChats.filter((chat) =>
    chat.toUser.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full overflow-y-auto flex flex-col h-[calc(100vh-3.2rem)] p-1 border-rounded-md">
      <div className="flex items-center rounded-full px-4 py-1 bg-gray-800 mb-2 border-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-0 border-none focus-visible:ring-0 !bg-gray-800"
          placeholder="Search here..."
        />
        <SearchIcon size={18} className="text-[var(--cool-gray)]" />
      </div>

      {noChats && <NoItems className="mt-8" />}

      {!noChats && (
        <div className="flex flex-col h-full flex-grow overflow-y-auto hide-scrollbar">
          {filteredChats.map((chat) => (
            <div
              className={`flex justify-between py-2 hover:cursor-pointer hover:bg-gray-100/50 px-2 rounded-md  ${
                selectedUserId === chat.toUser.id ? "bg-gray-200/60" : ""
              } `}
              onClick={() => handleClick(chat.toUser.id)}
              key={chat.id}
            >
              <div className="flex gap-4">
                <div className="relative rounded-full flex w-12 h-12">
                  <DP
                    url={
                      chat?.toUser?.avatar
                        ? `${cdnURL}${chat.toUser.avatar}`
                        : ProfilePic
                    }
                    alt={chat?.toUser?.name}
                  />
           
                </div>
                <div className="flex flex-col gap-1">
                  <div className="font-semibold">{chat.toUser.name}</div>
                  <div className="text-sm text-[var(--cool-gray)]">
                  {chat?.lastMessage?.message 
    ? (chat.lastMessage.message.length > 20 
        ? `${chat.lastMessage.message.substring(0, 20)}...`
        : chat.lastMessage.message)
    : "No messages yet"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="text-[var(--cool-gray)] text-[0.8rem]">
                  {chat?.lastMessage?.createdAt
                    ? formatTo12Hour(chat.lastMessage.createdAt)
                    : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;
