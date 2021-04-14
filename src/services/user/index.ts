import UserServiceClient from "sc-user-service-client";

import appSettings from "../../common/app-settings";

export class UserClientCommunication {
    private static instance: UserServiceClient;

    public static getUserClientInstance() {
        console.log(appSettings);
        const userServiceUri = `${appSettings.ssl ? "https" : "http"}://${appSettings.proxyUrl}/user`;
        return this.instance ?? new UserServiceClient(userServiceUri);
    }
}
