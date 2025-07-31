import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "./api";
import { bookingFiltersType } from "@/lib/interface-types";

export const useBookings = (filters: bookingFiltersType) => {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => fetchBookings(filters),

    enabled: true,
  });
};
