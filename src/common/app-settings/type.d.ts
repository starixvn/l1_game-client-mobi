import { GameBaseProps } from "../../components/shared/game-base/type";
import { KenoMatchProps } from "../../components/games/keno-match/type";

interface ProxySetting {
    ssl: string;
    subDomain: string;
    path: string;
}

interface SentryOptions {
    dsn: string;
    environment: string;
}

export default interface AppSettings {
    serverDomainMapper: Array<string>;
    subSocketGatewayDomain: string;
    proxy: ProxySetting;
    sentry: SentryOptions;
    gameSettings: { [id: string]: GameBaseProps | KenoMatchProps };
    subGuideDomain: string;
    googleAnalyticId: string;
    enableMsgpackParser: boolean;
    system: string;
    appType: number;
}
