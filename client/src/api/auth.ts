import { AxiosError } from "axios";
import apiClient from "./axiosConfig";

const registerUser = async (
  userName: string,
  email: string,
  password: string
) => {
  try {
    const response = await apiClient.post("/user/signup", {
      userName,
      email,
      password,
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
};

const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post(`/user/signin`, {
      email,
      password,
    });
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const err = error as AxiosError;
    return {
      success: false,
      data: err.response?.data || "An error occurred",
      status: err.response?.status || 500,
    };
  }
};

export { registerUser, loginUser };
