import appSettings from "../../common/app-settings";
import UserServiceClient from "sc-user-service-client";

export class UserClientCommunication {
    public static getUserClientInstance() {
        const gameUserUrl = appSettings.userServiceBaseUrl;
        const userService = new UserServiceClient(gameUserUrl);

        return userService.auth;
    }
}
