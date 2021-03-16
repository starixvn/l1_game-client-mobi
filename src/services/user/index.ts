import axios from "axios";

import appSettings from "../../app-settings";
import { AuthorizeResponse, BaseResponse, ReCheckInResponse, Session, SignNameResponse } from "./user";

const axiosInstance = axios.create({ baseURL: appSettings.userServiceBaseUrl });

export const UserService = {
    signIn: async (token: string): Promise<Session> => {
        const response = await axiosInstance.get<Session>(`/auth/sso?token=${token}&system=2`);
        return response.data;
    },

    reCheckIn: async (session: Session): Promise<ReCheckInResponse> => {
        const request = {
            session: session.ss,
            username: session.username,
            browserUserAgent: navigator.userAgent,
        };
        const response = await axiosInstance.post<ReCheckInResponse>("/auth/reCheckIn", request);
        return response.data;
    },

    authorize: async (session: Session): Promise<AuthorizeResponse> => {
        const request = {
            session: session.ss,
            username: session.username,
            browserUserAgent: navigator.userAgent,
        };
        const response = await axiosInstance.post<AuthorizeResponse>("/auth/authorize", request);
        return response.data;
    },

    signName: async (session: Session, nickname: string): Promise<SignNameResponse> => {
        const request = {
            session: session.ss,
            username: session.username,
            nickname: nickname,
            browserUserAgent: navigator.userAgent,
        };
        const response = await axiosInstance.post<SignNameResponse>("auth/signName", request);
        return response.data;
    },

    verifySession: async (session: Session) => {
        const request = {
            session: session.ss,
            username: session.username,
            browserUserAgent: navigator.userAgent,
        };
        const response = await axiosInstance.post<BaseResponse>("auth/session/verify", request);
        return response.data;
    },
};
