import axiosInstance from "@/store/axiosInstance";

export const getAllChats = async () => {
  const { data } = await axiosInstance.get("/api/v1/message");
  return data;
};

export const getUsersChatsHistory = async ({ userId }: { userId: string }) => {
  const { data } = await axiosInstance.get(
    `/api/v1/message/${userId}/chat-history`
  );
  return data;
};
