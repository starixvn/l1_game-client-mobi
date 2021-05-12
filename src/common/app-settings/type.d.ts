import { GameBaseProps } from "../../components/shared/game-base/type";

interface ProxySetting {
    ssl: string;
    uri: string;
    path: string;
}

interface SentryOptions {
    dns: string;
    environment: string;
}
export default interface AppSettings {
    proxy: ProxySetting;
    sentry: SentryOptions;
    offeredGames: number[];
    gameSettings: { [id: string]: GameBaseProps };
}
