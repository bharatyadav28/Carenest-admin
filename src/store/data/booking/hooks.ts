import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  assignCaregiver,
  cancelBooking,
  completeBooking,
  fetchBookingById,
  fetchBookings,
  updateBookingDetails,
  updatedDataType,
} from "./api";
import { bookingFiltersType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

export const useBookings = (filters: bookingFiltersType) => {
  return useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => fetchBookings(filters),
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useBookingById = (bookingId: string) => {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => fetchBookingById(bookingId),
  });
};

export const useAssignCaregiver = (bookingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caregiverId }: { caregiverId: string }) =>
      assignCaregiver(bookingId, caregiverId),

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => completeBooking(bookingId),

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateBookingDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      updatedData,
    }: {
      bookingId: string;
      updatedData: updatedDataType;
    }) => updateBookingDetails(bookingId, updatedData),

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};
