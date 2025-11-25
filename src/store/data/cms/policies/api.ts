import axiosInstance from "@/store/axiosInstance";
import { responseType } from "@/lib/interface-types";

// Type alias for policy types
export type PolicyTypeEnum = "privacy" | "terms" | "legal";

export interface Policy {
  id: string;
  type: PolicyTypeEnum;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyCreateOrUpdateType {
  type: PolicyTypeEnum;
  content: string;
}

export interface PoliciesData {
  policies: Policy[];
  count: number;
}

// Response types that match your backend structure
export interface PoliciesResponse extends responseType {
  data: PoliciesData;
}

export interface PolicyResponse extends responseType {
  data: {
    policy: Policy;
  };
}

// Get all policies
export const fetchPolicies = async (): Promise<PoliciesResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/policy`);
  return data;
};

// Get policy by type
export const fetchPolicyByType = async (type: PolicyTypeEnum): Promise<PolicyResponse> => {
  const { data } = await axiosInstance.get(`/api/v1/policy/getPolicyByType/${type}`);
  return data;
};

// Create or update policy
export const createOrUpdatePolicy = async (policyData: PolicyCreateOrUpdateType): Promise<PolicyResponse> => {
  const { data } = await axiosInstance.post(`/api/v1/policy/createOrUpdatePolicy`, policyData);
  return data;
};

// Delete policy
export const deletePolicy = async (type: PolicyTypeEnum): Promise<PolicyResponse> => {
  const { data } = await axiosInstance.delete(`/api/v1/policy/${type}`);
  return data;
};