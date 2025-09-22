import axiosInstance from "@/store/axiosInstance";

export const getDashboardData = async () => {
  const { data } = await axiosInstance.get("/api/v1/admin/dashboard-stats");
  return data;
};
