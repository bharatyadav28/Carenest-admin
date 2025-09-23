import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchCareSeekers,
  fetchCareSeekerById,
  fetchCareSeekerBookings,
  updateCareSeeker,
  deleteCareSeeker,
  CareSeekerFiltersType,
  CareSeekerCreateType,
} from "./api";
import { showError } from "@/lib/resuable-fns";

// Fetch all care seekers
export const useCareSeekers = (filters: CareSeekerFiltersType) => {
  return useQuery({
    queryKey: ["careSeekers", filters], // list
    queryFn: () => fetchCareSeekers(filters),
  });
};

// Fetch care seeker by ID
export const useCareSeekerById = (userId: string) => {
  return useQuery({
    queryKey: ["careSeekers", userId], // single
    queryFn: () => fetchCareSeekerById(userId),
    enabled: !!userId,
  });
};

// Fetch bookings of a care seeker
export const useCareSeekerBookings = (userId: string) => {
  return useQuery({
    queryKey: ["careSeekerBookings", userId],
    queryFn: () => fetchCareSeekerBookings(userId),
    enabled: !!userId,
  });
};

// Update care seeker
export const useUpdateCareSeeker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updatedUser,
    }: {
      userId: string;
      updatedUser: Partial<CareSeekerCreateType>;
    }) => {
      const payload = {
        ...updatedUser,
        zipcode: updatedUser.zipcode ? Number(updatedUser.zipcode) : undefined,
      };
    
      return updateCareSeeker(userId, payload);
    },
    onSuccess: (data, variables) => {
      toast.success(data?.message);
  console.log("success hi hi hi")
      // Invalidate BOTH query keys
      queryClient.invalidateQueries({ queryKey: ["careSeekers"] });
      
      
      // Invalidate single care seeker queries
      queryClient.invalidateQueries({ queryKey: ["careSeekers", variables.userId] });
    },
    onError: (error) => showError(error),
  });
};

// Delete care seeker
export const useDeleteCareSeeker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteCareSeeker(userId)
    ,
    
    onSuccess: (data) => {
      toast.success(data?.message);
      // Invalidate BOTH query keys
      queryClient.invalidateQueries({ queryKey: ["careSeekers"] });
    },
    onError: (error) => showError(error),
  });
};
