import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

import { fetchGivers, fetchProfile, signin, updateProfile } from "./api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookieConfig } from "@/lib/resuable-fns";
import { toast } from "sonner";

export const useSignin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signin,

    onSuccess: (data) => {
      toast.success(data?.message);
      const { accessToken, refreshToken } = data?.data;

      Cookies.set("accessToken", accessToken, getCookieConfig(accessToken));
      Cookies.set("refreshToken", refreshToken, getCookieConfig(refreshToken));

      navigate("/");
    },

    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data?.message || "Signin failed");
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error?.response?.data?.message || "Signin failed");
    },
  });
};

export const useGivers = (search: string) => {
  return useQuery({
    queryKey: ["givers", search],
    queryFn: () => fetchGivers(search),
  });
};
