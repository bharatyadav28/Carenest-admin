import { useQuery } from "@tanstack/react-query";

import { getAllChats, getUsersChatsHistory } from "./api";
import type {
  chatMessageType,
  chatType,
  otherUserDetailsType,
} from "@/lib/interface-types";
import { responseType } from "@/lib/interface-types";

interface getAllChatsResponse extends responseType {
  data: {
    conversations: chatType[];
  };
}
export const useGetAllChats = () => {
  return useQuery<getAllChatsResponse>({
    queryKey: ["chats"],
    queryFn: () => getAllChats(),
  });
};

interface chatHistoryResponse extends responseType {
  data: {
    messages: chatMessageType[];
    otherUserDetails: otherUserDetailsType;
  };
}

export const useGetChatHistory = (userId?: string) => {
  return useQuery<chatHistoryResponse>({
    queryKey: ["chats", userId],
    queryFn: () => getUsersChatsHistory({ userId: userId! }),
    enabled: Boolean(userId && userId.trim() !== ""),
  });
};
