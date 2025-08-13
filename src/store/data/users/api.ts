import axiosInstance from "@/store/axiosInstance";

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
