import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchAllLocationServices,
  fetchLocationServiceById,
  fetchLocationServiceByCityState,
  createLocationService,
  updateLocationService,
  deleteLocationService,
  addServiceItem,
  updateServiceItem,
  deleteServiceItem,
  LocationServiceCreateType,
  LocationServiceUpdateType,
  ServiceItemInput,
  LocationServicesResponse,
  LocationServiceResponse,
} from "./api";
import { showError } from "@/lib/resuable-fns";

// Get all location services
export const useAllLocationServices = () => {
  return useQuery<LocationServicesResponse>({
    queryKey: ["location-services"],
    queryFn: fetchAllLocationServices,
    retry: 1,
  });
};

// Get location service by ID
export const useLocationService = (id: string) => {
  return useQuery<LocationServiceResponse>({
    queryKey: ["location-service", id],
    queryFn: () => fetchLocationServiceById(id),
    enabled: !!id,
    retry: 1,
  });
};

// Get location service by city and state
export const useLocationServiceByCityState = (city: string, state: string) => {
  return useQuery<LocationServiceResponse>({
    queryKey: ["location-service", city, state],
    queryFn: () => fetchLocationServiceByCityState(city, state),
    enabled: !!city && !!state,
    retry: 1,
  });
};

// Create location service mutation
export const useCreateLocationService = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LocationServiceResponse,
    Error,
    LocationServiceCreateType
  >({
    mutationFn: createLocationService,
    onSuccess: (data) => {
      toast.success(data?.message || "Location service created successfully");
      queryClient.invalidateQueries({ queryKey: ["location-services"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Update location service mutation
export const useUpdateLocationService = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LocationServiceResponse,
    Error,
    { id: string; updateData: LocationServiceUpdateType }
  >({
    mutationFn: ({ id, updateData }) => updateLocationService(id, updateData),
    onSuccess: (data, variables) => {
      toast.success(data?.message || "Location service updated successfully");
      queryClient.invalidateQueries({ queryKey: ["location-services"] });
      queryClient.invalidateQueries({ queryKey: ["location-service", variables.id] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Delete location service mutation
export const useDeleteLocationService = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LocationServiceResponse,
    Error,
    string
  >({
    mutationFn: deleteLocationService,
    onSuccess: (data) => {
      toast.success(data?.message || "Location service deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["location-services"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Add service item mutation
export const useAddServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LocationServiceResponse,
    Error,
    { id: string; serviceData: ServiceItemInput }
  >({
    mutationFn: ({ id, serviceData }) => addServiceItem(id, serviceData),
    onSuccess: ( variables) => {
      toast.success("Service item added successfully");
      queryClient.invalidateQueries({ queryKey: ["location-service", variables] });
      queryClient.invalidateQueries({ queryKey: ["location-services"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Update service item mutation
export const useUpdateServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LocationServiceResponse,
    Error,
    { id: string; serviceId: string; updateData: ServiceItemInput }
  >({
    mutationFn: ({ id, serviceId, updateData }) => updateServiceItem(id, serviceId, updateData),
    onSuccess: ( variables) => {
      toast.success("Service item updated successfully");
      queryClient.invalidateQueries({ queryKey: ["location-service", variables] });
      queryClient.invalidateQueries({ queryKey: ["location-services"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Delete service item mutation
export const useDeleteServiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation<
    LocationServiceResponse,
    Error,
    { id: string; serviceId: string }
  >({
    mutationFn: ({ id, serviceId }) => deleteServiceItem(id, serviceId),
    onSuccess: ( variables) => {
      toast.success("Service item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["location-service", variables] });
      queryClient.invalidateQueries({ queryKey: ["location-services"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Re-export types
export type {
  LocationServiceType,
  LocationServiceCreateType,
  LocationServiceUpdateType,
  ServiceItem,
  ServiceItemInput,
} from "./api";