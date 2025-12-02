import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchAllApplications,
  fetchApplicationById,
  fetchApplicationStats,
  updateApplicationStatus,
  deleteApplication,
  CaregiverApplicationType,
  ApplicationsResponse,
  ApplicationStats,
  UpdateStatusData,
  ApplicationsQueryParams,
} from "./api";
import { responseType } from "@/lib/interface-types";
import { showError } from "@/lib/resuable-fns";

interface ApplicationsResponseType extends responseType {
  data: ApplicationsResponse;
}

interface SingleApplicationResponse extends responseType {
  data: {
    application: CaregiverApplicationType;
  };
}

interface StatsResponse extends responseType {
  data: {
    stats: ApplicationStats;
  };
}

// Fetch all applications with filtering and pagination
export const useAllApplications = (params?: ApplicationsQueryParams) => {
  return useQuery<ApplicationsResponseType>({
    queryKey: ["caregiver-applications", params],
    queryFn: () => fetchAllApplications(params),
    retry: 1,
  });
};

// Fetch single application by ID
export const useApplicationById = (id: string) => {
  return useQuery<SingleApplicationResponse>({
    queryKey: ["caregiver-application", id],
    queryFn: () => fetchApplicationById(id),
    retry: 1,
    enabled: !!id,
  });
};

// Fetch application statistics
export const useApplicationStats = () => {
  return useQuery<StatsResponse>({
    queryKey: ["caregiver-application-stats"],
    queryFn: () => fetchApplicationStats(),
    retry: 1,
  });
};

// Update application status
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statusData }: { id: string; statusData: UpdateStatusData }) =>
      updateApplicationStatus(id, statusData),

    onSuccess: (data) => {
      toast.success(data?.message || "Application status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["caregiver-applications"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-application-stats"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};

// Delete application
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),

    onSuccess: (data) => {
      toast.success(data?.message || "Application deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["caregiver-applications"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-application-stats"] });
    },

    onError: (error) => {
      showError(error);
    },
  });
};