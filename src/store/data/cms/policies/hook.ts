import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchPolicies,
  fetchPolicyByType,
  createOrUpdatePolicy,
  deletePolicy,
  PolicyCreateOrUpdateType,
  PoliciesResponse,
  PolicyResponse,
  
} from "./api";
import { showError } from "@/lib/resuable-fns";
export type PolicyTypeEnum = "privacy" | "terms" | "legal";

// Get all policies
export const usePolicies = () => {
  return useQuery<PoliciesResponse>({
    queryKey: ["policies"],
    queryFn: fetchPolicies,
    retry: 1,
  });
};

// Get policy by type
export const usePolicy = (type: PolicyTypeEnum) => {
  return useQuery<PolicyResponse>({
    queryKey: ["policy", type],
    queryFn: () => fetchPolicyByType(type),
    enabled: !!type,
    retry: 1,
  });
};

// Create or update policy mutation
export const useCreateOrUpdatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation<
    PolicyResponse,
    Error,
    PolicyCreateOrUpdateType
  >({
    mutationFn: createOrUpdatePolicy,
    onSuccess: (data, variables) => {
      const action = data?.message?.includes('created') ? 'created' : 'updated';
      toast.success(data?.message || `Policy ${action} successfully`);
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      queryClient.invalidateQueries({ queryKey: ["policy", variables.type] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};

// Delete policy mutation
export const useDeletePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation<
    PolicyResponse,
    Error,
    PolicyTypeEnum
  >({
    mutationFn: deletePolicy,
    onSuccess: (data) => {
      toast.success(data?.message || "Policy deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
    onError: (error) => {
      showError(error);
    },
  });
};