import axios, { AxiosInstance } from "axios";
import configs from "../../../Configs";

export interface AuthenticateResponse {
  username: string;
  language: string;
  ss: string;
  currency: string;
  isAuthenticated: boolean;
}

export interface ReCheckInResponse {
  isSuccessful: boolean;
  balance: number;
  isDisableAccount: boolean;
  message: string;
}

export default class UserServiceClient {
  private static instance: UserServiceClient;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: configs.userServiceUrl,
    });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new UserServiceClient();
    }

    return this.instance;
  }

  async authenticate(token: string) {
    const response = await this.axiosInstance.get<AuthenticateResponse>(
      `/auth/sso?token=${token}`
    );
    return response.data;
  }

  async reCheckIn(session: string, username: string) {
    const request = {
      session: session,
      username: username,
      browserUserAgent: navigator.userAgent,
    };
    const response = await this.axiosInstance.post<ReCheckInResponse>(
      "auth/reCheckIn",
      request
    );
    return response.data;
  }

  async authorize(session: string, username: string) {
    const request = {
      session: session,
      username: username,
      browserUserAgent: navigator.userAgent,
    };
    const response = await this.axiosInstance.post("auth/authorize", request);
    return response.data;
  }

  async signName(session: string, username: string, nickname: string) {
    const request = {
      session: session,
      username: username,
      nickname: nickname,
      browserUserAgent: navigator.userAgent,
    };
    const response = await this.axiosInstance.post("auth/signName", request);
    return response.data;
  }
}
