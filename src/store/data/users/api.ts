import { formSchema as createGiverSchema } from "@/components/user-management/GiverForm";
import axiosInstance from "@/store/axiosInstance";
import z from "zod";

interface signinPayloadType {
  email: string;
  password: string;
}
export const signin = async ({ email, password }: signinPayloadType) => {
  const { data } = await axiosInstance.post("/api/v1/user/signin", {
    email,
    password,
    role: "admin",
  });

  return data;
};

export const fetchProfile = async () => {
  const { data } = await axiosInstance.get("/api/v1/admin/profile");
  return data;
};

interface profilePayloadType {
  name: string;
  email: string;
  password?: string;
}
export const updateProfile = async (payload: profilePayloadType) => {
  const { data } = await axiosInstance.put("/api/v1/admin/profile", payload);
  return data;
};

export const fetchGivers = async (search: string) => {
  const { data } = await axiosInstance.get("/api/v1/giver", {
    params: {
      search,
    },
  });
  return data;
};

type createCaregiverPayloadType = z.infer<typeof createGiverSchema>;
export const createCaregiver = async (payload: createCaregiverPayloadType) => {
  const { data } = await axiosInstance.post("/api/v1/user/manage-by-admin", {
    ...payload,
    zipcode: Number(payload.zipcode),
    role: "giver",
  });
  return data;
};

// ------------------ CARESEEKER ------------------
export const fetchSeekers = async (search: string) => {
  const { data } = await axiosInstance.get("/api/v1/user", {
    params: { search },
  });
  return data;
};

type createCareseekerPayloadType = z.infer<typeof createGiverSchema>; 
export const createCareseeker = async (payload: createCareseekerPayloadType) => {
  const { data } = await axiosInstance.post("/api/v1/user/manage-by-admin", {
    ...payload,
    zipcode: Number(payload.zipcode),
    role: "user", 
  });
  return data;
};
