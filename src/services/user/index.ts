import axios from "axios";

import appSettings from "../../app-settings";
import { AuthorizeResponse, ReCheckInResponse, SignInResponse, SignNameResponse } from "./user";

const axiosInstance = axios.create({ baseURL: appSettings.userServiceBaseUrl });

export const UserService = {
    signIn: async (token: string): Promise<SignInResponse> => {
        const response = await axiosInstance.get<SignInResponse>(`/auth/sso?token=${token}`);
        return response.data;
    },

    reCheckIn: async (session: string, username: string): Promise<ReCheckInResponse> => {
        const request = {
            session: session,
            username: username,
            browserUserAgent: navigator.userAgent,
        };
        const response = await axiosInstance.post<ReCheckInResponse>("/auth/reCheckIn", request);
        return response.data;
    },

    authorize: async (session: string, username: string): Promise<AuthorizeResponse> => {
        const request = {
            session: session,
            username: username,
            browserUserAgent: navigator.userAgent,
        };
        const response = await axiosInstance.post<AuthorizeResponse>("/auth/authorize", request);
        return response.data;
    },

    signName: async (session: string, username: string, nickname: string): Promise<SignNameResponse> => {
        const request = {
            session: session,
            username: username,
            nickname: nickname,
            browserUserAgent: navigator.userAgent,
        };
        const response = await axiosInstance.post("auth/signName", request);
        return response.data;
    },
};
