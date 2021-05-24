import { GameBaseProps } from "../../components/shared/game-base/type";

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
    proxy: ProxySetting;
    sentry: SentryOptions;
    offeredGames: number[];
    gameSettings: { [id: string]: GameBaseProps };
}
