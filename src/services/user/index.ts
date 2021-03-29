import appSettings from "../../common/app-settings";
import UserServiceClient from "sc-user-service-client";

export class UserClientCommunication {
    private static instance: UserServiceClient;

    public static getUserClientInstance() {
        return this.instance ?? new UserServiceClient(appSettings.userServiceBaseUrl);
    }
}
