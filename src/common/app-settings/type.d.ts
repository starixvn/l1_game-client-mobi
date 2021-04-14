import { GameBaseProps } from "../../components/shared/game-base/type";

export default interface AppSettings {
    ssl: string;
    proxyUrl: sting;
    offeredGames: number[];
    gameConfigs: { [id: string]: GameBaseProps };
}
