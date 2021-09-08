import { UserStakeLevel } from "../shared/game-base/type";

export type Props = {
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    setApiErrorMessage: Function;
    userStakeLevel: UserStakeLevel;
    updateUserStakeLevel: Function;
    updateFavoriteGames: Function;
    favoriteGames: number[];
    queryGame: number;
};
