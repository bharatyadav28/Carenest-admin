import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchCareGivers,
  fetchCareGiverById,
  fetchCareGiverBookings,
  updateCareGiver,
  deleteCareGiver,
  sendBulkEmail,
  bulkUploadUsers,
  CareGiverFiltersType,
  CareGiverCreateType,
  BulkEmailRequestType,
  BulkUploadResponseType,
} from "./api";
import { showError } from "@/lib/resuable-fns";

// Fetch all caregivers
export const useCareGivers = (filters: CareGiverFiltersType) => {
  return useQuery({
    queryKey: ["careGivers", filters],
    queryFn: () => fetchCareGivers(filters),
  });
};

// Fetch caregiver by ID
export const useCareGiverById = (userId: string) => {
  return useQuery({
    queryKey: ["careGivers", userId],
    queryFn: () => fetchCareGiverById(userId),
  });
};

// Fetch caregiver bookings
export const useCareGiverBookings = (userId: string) => {
  return useQuery({
    queryKey: ["careGiverBookings", userId],
    queryFn: () => fetchCareGiverBookings(userId),
  });
};

// Update caregiver
export const useUpdateCareGiver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updatedUser,
    }: {
      userId: string;
      updatedUser: Partial<CareGiverCreateType>;
    }) => {
      const payload = {
        ...updatedUser,
        zipcode: updatedUser.zipcode ? Number(updatedUser.zipcode) : undefined,
      };
    
      return updateCareGiver(userId, payload);
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message);

      // Invalidate caregiver list
      queryClient.invalidateQueries({ queryKey: ["careGivers"] });

      // Invalidate single caregiver details
      queryClient.invalidateQueries({ queryKey: ["careGivers", variables.userId] });

    },
    onError: (error) => showError(error),
  });
};

// Delete caregiver
export const useDeleteCareGiver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => deleteCareGiver(userId),
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["careGivers"] });
    },
    onError: (error) => showError(error),
  });
};

// Send bulk email mutation
export const useSendBulkEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emailData: BulkEmailRequestType) => sendBulkEmail(emailData),
    onSuccess: (data) => {
      toast.success("Emails are being sent!");
    },
    onError: (error) => showError(error),
  });
};

// Bulk upload users mutation
export const useBulkUploadUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bulkUploadUsers(file),
    onSuccess: (data) => {
      toast.success(data?.message || "Bulk user upload started!");
      // Invalidate caregivers list after bulk upload
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["careGivers"] });
      }, 5000); // Wait 5 seconds before refreshing
    },
    onError: (error) => showError(error),
  });
};