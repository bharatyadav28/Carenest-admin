import axiosInstance from "@/store/axiosInstance";
import { bookingFiltersType } from "@/lib/interface-types";

export const fetchBookings = async (filters: bookingFiltersType) => {
  const searchParams = new URLSearchParams();

  // Add parameters only if they have values
  if (filters.page) searchParams.append("page", filters.page.toString());
  if (filters.search) searchParams.append("search", filters.search);
  if (filters.bookedOn) searchParams.append("bookedOn", filters.bookedOn);
  if (filters.appointmentDate)
    searchParams.append("appointmentDate", filters.appointmentDate);
  if (filters.status) searchParams.append("status", filters.status);

  const { data } = await axiosInstance.get(
    `/api/v1/booking?${searchParams.toString()}`
  );
  return data;
};
