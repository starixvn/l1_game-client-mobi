import { GameBaseProps } from "../../components/shared/game-base/type";

interface ProxySetting {
    ssl: string;
    uri: string;
    path: string;
}

export default interface AppSettings {
    proxy: ProxySetting;
    offeredGames: number[];
    gameConfigs: { [id: string]: GameBaseProps };
}
