import axiosInstance from "@/store/axiosInstance";

export interface CaregiverApplicationType {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
  zipcode: string;
  description: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  isReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationsResponse {
  applications: CaregiverApplicationType[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApplicationStats {
  total: number;
  pendingReview: number;
  byStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface UpdateStatusData {
  status: "pending" | "reviewed" | "approved" | "rejected";
  isReviewed?: boolean;
}

// Query parameters interface
export interface ApplicationsQueryParams {
  status?: string;
  is_reviewed?: string;
  search?: string; // Add search parameter
  sort_by?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Updated fetchAllApplications function
export const fetchAllApplications = async (params?: ApplicationsQueryParams) => {
  const queryParams = new URLSearchParams();
  
  // Only append non-empty, non-undefined, non-null values
  if (params?.status && params.status !== "") {
    queryParams.append('status', params.status);
  }
  
  if (params?.is_reviewed !== undefined && params.is_reviewed !== "") {
    queryParams.append('is_reviewed', params.is_reviewed.toString());
  }
  
  // Add search parameter
  if (params?.search && params.search !== "") {
    queryParams.append('search', params.search);
  }
  
  if (params?.sort_by && params.sort_by !== "") {
    queryParams.append('sort_by', params.sort_by);
  }

  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const { data } = await axiosInstance.get(`/api/v1/caregiver-application?${queryParams}`);
  return data;
};
export const fetchApplicationById = async (id: string) => {
  const { data } = await axiosInstance.get(`/api/v1/caregiver-application/${id}`);
  return data;
};

export const fetchApplicationStats = async () => {
  const { data } = await axiosInstance.get(`/api/v1/caregiver-application/stats`);
  return data;
};

export const updateApplicationStatus = async (id: string, statusData: UpdateStatusData) => {
  const { data } = await axiosInstance.put(
    `/api/v1/caregiver-application/${id}/status`,
    statusData
  );
  return data;
};

export const deleteApplication = async (id: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/caregiver-application/${id}`);
  return data;
};