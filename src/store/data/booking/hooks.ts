import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  addNewWeeklySchedule,
  assignCaregiver,
  cancelBooking,
  completeBooking,
  deleteWeeklySchedule,
  fetchBookingById,
  fetchBookings,
  updateBookingDetails,
  updatedDataType,
  updateWeeklySchedule,
} from "./api";
import {
  bookingFiltersType,
  bookingType,
  responseType,
  weeklyScheduleType,
} from "@/lib/interface-types";
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

interface bookingByIdResponse extends responseType {
  data: {
    booking: bookingType;
  };
}

export const useBookingById = (bookingId: string) => {
  return useQuery<bookingByIdResponse>({
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

export const useAddNewWeeklySchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      scheduledData,
    }: {
      bookingId: string;
      scheduledData: weeklyScheduleType;
    }) => addNewWeeklySchedule(bookingId, scheduledData),

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useUpdateWeeklySchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      scheduledData,
      scheduleId,
    }: {
      bookingId: string;
      scheduledData: weeklyScheduleType;
      scheduleId: string;
    }) => updateWeeklySchedule(bookingId, scheduleId, scheduledData),

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

export const useDeleteWeeklySchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      scheduleId,
    }: {
      bookingId: string;
      scheduleId: string;
    }) => deleteWeeklySchedule(bookingId, scheduleId),

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};
