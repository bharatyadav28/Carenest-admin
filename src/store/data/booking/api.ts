import axiosInstance from "@/store/axiosInstance";
import { bookingFiltersType } from "@/lib/interface-types";

export const fetchBookings = async (filters: bookingFiltersType) => {
  const searchParams = new URLSearchParams();

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

export const cancelBooking = async (bookingId: string) => {
  const { data } = await axiosInstance.put(
    `/api/v1/booking/${bookingId}/cancel/admin`
  );

  return data;
};

export const fetchBookingById = async (bookingId: string) => {
  const { data } = await axiosInstance.get(`/api/v1/booking/${bookingId}`);
  return data;
};

export const assignCaregiver = async (
  bookingId: string,
  caregiverId: string
) => {
  const { data } = await axiosInstance.put(
    `/api/v1/booking/${bookingId}/assign`,
    {
      caregiverId,
    }
  );

  return data;
};

export const completeBooking = async (bookingId: string) => {
  const { data } = await axiosInstance.put(
    `/api/v1/booking/${bookingId}/complete`
  );
  return data;
};

export interface updatedDataType {
  appointmentDate: string;
  duration: number;
}
export const updateBookingDetails = async (
  bookingId: string,
  updatedData: updatedDataType
) => {
  const { data } = await axiosInstance.put(
    `/api/v1/booking/${bookingId}`,
    updatedData
  );
  return data;
};
