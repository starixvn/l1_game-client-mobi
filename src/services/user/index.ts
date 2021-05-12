import UserServiceClient from "sc-user-service-client";

import appSettings from "../../common/app-settings";

export class UserClientCommunication {
    private static readonly instance: UserServiceClient;

    public static getUserClientInstance() {
        const { proxy } = appSettings;
        const userServiceUri = `${proxy.ssl ? "https" : "http"}://${proxy.uri + proxy.path}/user`;
        return this.instance ?? new UserServiceClient(userServiceUri);
    }
}
