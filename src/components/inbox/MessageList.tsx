import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import NoItems from "@/components/common/NoItems";
import DP from "@/components/common/DP";
import ProfilePic from "@/assets/profilepic1.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetAllChats } from "@/store/data/inbox/hooks";
import { formatTo12Hour } from "@/lib/resuable-fns";

interface Props {
  handleOpenMessages: () => void;
}

function MessageList({ handleOpenMessages }: Props) {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const chats = useGetAllChats();
  const navigate = useNavigate();

  const chatList = chats?.data?.data?.conversations;
  console.log("chats data", chatList);

  const noChats = chatList?.length === 0;
  // const noChats = true;

  const handleClick = (userId: string) => {
    if (isMobile) {
      handleOpenMessages();
    }
    setSelectedUserId(userId);
  };

  useEffect(() => {
    if (selectedUserId) {
      navigate(`?userId=${selectedUserId}`);
    }
  }, [selectedUserId, navigate]);

  return (
    <div className="w-full overflow-y-auto flex flex-col h-[calc(100vh-3.2rem)] p-1 border-rounded-md">
      <div className="flex items-center rounded-full px-4 py-1 bg-[var(--light-gray)] mb-2 ">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-0 border-none focus-visible:ring-0 "
          placeholder="Search here..."
        />
        <SearchIcon size={18} className="text-[var(--cool-gray)] " />
      </div>

      {noChats && <NoItems className="mt-8" />}

      {!noChats && (
        <div className="flex flex-col h-full flex-grow overflow-y-auto hide-scrollbar">
          {chatList?.map((chat) => (
            <div
              className="flex justify-between py-2 hover:cursor-pointer hover:bg-gray-100  px-2 rounded-md transition-all "
              onClick={() => handleClick(chat.toUser.id)}
              key={chat.id}
            >
              <div className="flex gap-4">
                <div className=" relative rounded-full flex w-12 h-12">
                  <DP
                    url={
                      chat?.toUser?.avatar
                        ? `cdnURL${chat?.toUser?.avatar}`
                        : ProfilePic
                    }
                    alt={chat?.toUser?.name}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="font-semibold"> {chat?.toUser?.name}</div>
                  <div className="text-sm text-[var(--cool-gray)]">
                    {" "}
                    {chat?.lastMessage?.message}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="text-[var(--cool-gray)] text-[0.8rem]">
                  {" "}
                  {chat?.lastMessage?.createdAt
                    ? formatTo12Hour(chat.lastMessage.createdAt)
                    : ""}
                </div>
                {chat?.unReadCount > 0 && (
                  <div className="bg-primary text-[#fff] px-2  rounded-full text-sm">
                    {" "}
                    {chat?.unReadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageList;
