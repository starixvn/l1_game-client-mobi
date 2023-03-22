import UserServiceClient from "sc-user-service-client";
import appSettings from "../common/app-settings";
import { buildUrlWithPath } from "../helpers/url-helper";

export class UserClientCommunication {
    private static readonly instance: UserServiceClient;

    public static getUserClientInstance() {
        return this.instance ?? new UserServiceClient(this.getUserServiceUrl());
    }

    private static getUserServiceUrl(): string {
        const { proxy } = appSettings;
        const path = proxy.path === "" ? "/user" : `${proxy.path}/user`;
        return buildUrlWithPath(path);
    }
}
