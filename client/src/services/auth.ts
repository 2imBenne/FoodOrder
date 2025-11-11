import { api, setAccessToken } from "./api";
import { User } from "../types";

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);
  setAccessToken(data.accessToken);
  return data;
};

export const register = async (payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  setAccessToken(data.accessToken);
  return data;
};

export const refreshSession = async (
  refreshToken: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/refresh", {
    refreshToken,
  });
  setAccessToken(data.accessToken);
  return data;
};

export const fetchProfile = async (): Promise<{ user: User }> => {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data;
};
