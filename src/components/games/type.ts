import { Socket } from "socket.io-client";

import { BetSettingStorage } from "../shared/bet-settings/type";
import { UserStakeLevel } from "../shared/game-base/type";

export type Props = {
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    setApiErrorMessage: Function;
    updateBetSetting: Function;
    betSettings: BetSettingStorage;
    userStakeLevel: UserStakeLevel;
    updateUserStakeLevel: Function;
    updateFavoriteGames: Function;
    favoriteGames: number[];
    queryGame: number;
    socketGateway: Socket;
};
