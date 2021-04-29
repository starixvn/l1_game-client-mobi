import UserServiceClient from "sc-user-service-client";

import appSettings from "../../common/app-settings";

export class UserClientCommunication {
    private static readonly instance: UserServiceClient;

    public static getUserClientInstance() {
        const userServiceUri = `${appSettings.ssl ? "https" : "http"}://${appSettings.proxyUrl}/user`;
        return this.instance ?? new UserServiceClient(userServiceUri);
    }
}
