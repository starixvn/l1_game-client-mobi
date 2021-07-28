import { BetSettingStorage } from "../shared/bet-settings/type";
import { UserStakeLevel } from "../shared/game-base/type";

export type Props = {
    enabledWinningStreakNotification: boolean;
    enabledPlaySound: boolean;
    setApiErrorMessage: Function;
    updateBetSetting: Function;
    betSettings: BetSettingStorage;
    userStakeLevel: UserStakeLevel;
    isShowFavoriteSetting: boolean;
    toggleFavoriteSetting: Function;
};

export enum GameCategoryType {
    popular,
    favorite,
    keno,
    dice,
    card,
}
