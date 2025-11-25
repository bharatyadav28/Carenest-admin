import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchServices,
  fetchServicesByCareType,
  fetchServiceById,
  createService,
  updateService,
  ServiceCreateType,
  ServiceUpdateType,
  ServicesResponse,
  ServiceResponse,
  CareType,
} from "./api";
import { showError } from "@/lib/resuable-fns";

// Get all services
export const useServices = () => {
  return useQuery<ServicesResponse>({
    queryKey: ["services"],
    queryFn: fetchServices,
    retry: 1,
  });
};

// Get services by care type
export const useServicesByCareType = (careType: CareType) => {
  return useQuery<ServicesResponse>({
    queryKey: ["services", careType],
    queryFn: () => fetchServicesByCareType(careType),
    enabled: !!careType,
    retry: 1,
  });
};

// Get service by ID
export const useService = (id: string) => {
  return useQuery<ServiceResponse>({
    queryKey: ["service", id],
    queryFn: () => fetchServiceById(id),
    enabled: !!id,
    retry: 1,
  });
};

// Create service mutation
export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ServiceResponse,
    Error,
    ServiceCreateType
  >({
    mutationFn: createService,
    onSuccess: (data) => {
      toast.success(data?.message || "Service created successfully");
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Update service mutation
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ServiceResponse,
    Error,
    { id: string; updateData: ServiceUpdateType }
  >({
    mutationFn: ({ id, updateData }) => updateService(id, updateData),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Service updated successfully");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["services", variables.updateData.careType] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

