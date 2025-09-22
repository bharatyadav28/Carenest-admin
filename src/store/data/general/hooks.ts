import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "./api";
import { dashboardDataType, responseType } from "@/lib/interface-types";

interface dashboardDataResponseType extends responseType {
  data: {
    stats: dashboardDataType;
  };
}
export const useGetDashboardData = () => {
  return useQuery<dashboardDataResponseType>({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  });
};
