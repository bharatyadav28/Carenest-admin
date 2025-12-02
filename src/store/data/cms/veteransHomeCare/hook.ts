import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchVeteransHomeCare,
  createVeteransHomeCare,
  updateVeteransHomeCare,
  deleteVeteransHomeCare,
  updatePoints,
  addPoint,
  updatePoint,
  deletePoint,
  VeteransHomeCareCreateType,
  VeteransHomeCareUpdateType,
  VeteransHomeCareResponse,
} from "./api";
import { showError } from "@/lib/resuable-fns";

// Get Veterans Home Care page
export const useVeteransHomeCare = () => {
  return useQuery<VeteransHomeCareResponse>({
    queryKey: ["veterans-home-care"],
    queryFn: fetchVeteransHomeCare,
    retry: false, // Don't retry on 404
  });
};

// Create Veterans Home Care mutation
export const useCreateVeteransHomeCare = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VeteransHomeCareResponse,
    Error,
    VeteransHomeCareCreateType
  >({
    mutationFn: createVeteransHomeCare,
    onSuccess: (data) => {
      toast.success(data?.message || "Veterans Home Care page created successfully");
      queryClient.setQueryData(["veterans-home-care"], data);
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Update Veterans Home Care mutation
export const useUpdateVeteransHomeCare = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VeteransHomeCareResponse,
    Error,
    { id: string; updateData: VeteransHomeCareUpdateType }
  >({
    mutationFn: ({ id, updateData }) => updateVeteransHomeCare(id, updateData),
    onSuccess: (data) => {
      toast.success(data?.message || "Veterans Home Care page updated successfully");
      queryClient.setQueryData(["veterans-home-care"], data);
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Delete Veterans Home Care mutation
export const useDeleteVeteransHomeCare = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VeteransHomeCareResponse,
    Error,
    string
  >({
    mutationFn: deleteVeteransHomeCare,
    onSuccess: (data) => {
      toast.success(data?.message || "Veterans Home Care page deleted successfully");
      queryClient.removeQueries({ queryKey: ["veterans-home-care"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Update points mutation
export const useUpdatePoints = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VeteransHomeCareResponse,
    Error,
    { id: string; points: string[] }
  >({
    mutationFn: ({ id, points }) => updatePoints(id, points),
    onSuccess: (data) => {
      toast.success(data?.message || "Points updated successfully");
      queryClient.setQueryData(["veterans-home-care"], data);
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Add point mutation
export const useAddPoint = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VeteransHomeCareResponse,
    Error,
    { id: string; point: string }
  >({
    mutationFn: ({ id, point }) => addPoint(id, point),
    onSuccess: (data) => {
      toast.success(data?.message || "Point added successfully");
      queryClient.setQueryData(["veterans-home-care"], data);
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Update point mutation
export const useUpdatePoint = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VeteransHomeCareResponse,
    Error,
    { id: string; index: number; point: string }
  >({
    mutationFn: ({ id, index, point }) => updatePoint(id, index, point),
    onSuccess: (data) => {
      toast.success(data?.message || "Point updated successfully");
      queryClient.setQueryData(["veterans-home-care"], data);
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Delete point mutation
export const useDeletePoint = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VeteransHomeCareResponse,
    Error,
    { id: string; index: number }
  >({
    mutationFn: ({ id, index }) => deletePoint(id, index),
    onSuccess: (data) => {
      toast.success(data?.message || "Point deleted successfully");
      queryClient.setQueryData(["veterans-home-care"], data);
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Re-export types
export type {
  VeteransHomeCareType,
  VeteransHomeCareCreateType,
  VeteransHomeCareUpdateType,
  PointOperationData,
} from "./api";