import { GameBaseProps } from "../../components/shared/game-base/type";
import { KenoMatchProps } from "../../components/games/keno-match/type";

interface ProxySetting {
    ssl: string;
    uri: string;
    path: string;
}

interface SentryOptions {
    dsn: string;
    environment: string;
}

export default interface AppSettings {
    socketGatewayUri: string;
    proxy: ProxySetting;
    sentry: SentryOptions;
    offeredGames: number[];
    gameSettings: { [id: string]: GameBaseProps | KenoMatchProps };
    guideUrl: string;
    googleAnalyticId: string;
    enableMsgpackParser: boolean;
    system: string;
    appType: number;
}
