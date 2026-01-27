import axiosInstance from "@/store/axiosInstance";

// Filters for fetching caregivers
export interface CareGiverFiltersType {
  page?: number;
  search?: string;
}

// Bulk email types
export interface BulkEmailRequestType {
  userIds: string[];
  subject: string;
  message: string;
}

// Bulk upload user types
export interface BulkUploadResponseType {
  success: boolean;
  message: string;
  data: {
    fileName: string;
    status: string;
  };
}

// Send bulk email
export const sendBulkEmail = async (emailData: BulkEmailRequestType) => {
  const { data } = await axiosInstance.post(
    `/api/v1/user/bulk-email/send`,
    emailData
  );
  return data;
};

// Bulk upload users
export const bulkUploadUsers = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosInstance.post(
    `/api/v1/user/bulk-upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

// Get all caregivers
export const fetchCareGivers = async (filters: CareGiverFiltersType) => {
  const searchParams = new URLSearchParams();
  if (filters.page) searchParams.append("page", filters.page.toString());
  if (filters.search) searchParams.append("search", filters.search);

  const { data } = await axiosInstance.get(`/api/v1/giver/all?${searchParams.toString()}`);
  return data;
};

// Get caregiver by ID
export const fetchCareGiverById = async (userId: string) => {
  const { data } = await axiosInstance.get(`/api/v1/giver/all/${userId}`);
  return data;
};

// Get caregiver bookings
export const fetchCareGiverBookings = async (userId: string) => {
  const { data } = await axiosInstance.get(`/api/v1/booking/giver/${userId}`);
  return data;
};

// Create new caregiver
export interface CareGiverCreateType {
  name: string;
  email: string;
  mobile: string;
  address: string;
  zipcode: string | number;
  gender: string;
  
  role: "giver";
}

export const createCareGiver = async (newUser: CareGiverCreateType) => {
  const { data } = await axiosInstance.post(`/api/v1/giver/manage-by-admin`, newUser);
  return data;
};

// Update caregiver
export const updateCareGiver = async (
  userId: string,
  updatedUser: Partial<CareGiverCreateType>
) => {
  const { data } = await axiosInstance.put(
    `/api/v1/user/manage-by-admin/${userId}`,
    updatedUser
  );
  return data;
};

// Delete caregiver
export const deleteCareGiver = async (userId: string) => {
  const { data } = await axiosInstance.delete(`/api/v1/user/manage-by-admin/${userId}`);
  return data;
};