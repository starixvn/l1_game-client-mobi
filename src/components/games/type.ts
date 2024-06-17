import { UserStakeLevel } from "../shared/game-base/type";

export type Props = {
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    setApiErrorMessage: Function;
    userStakeLevel: UserStakeLevel;
    updateUserStakeLevel: Function;
    favoriteGames: number[];
    queryGame: number;
    userOfferGames: number[];
    isShowSlidingChip: boolean;
    updateQueryGames: (gameId: number, isJoinGame: boolean, isClearOpenGameId: boolean) => void;
    isJoinGame: boolean;
    openGameId: number;
};
