import React from "react";
import { BetSettingStorage } from "../../components/shared/bet-settings/type";
import { UserStakeLevel } from "../../components/shared/game-base/type";

export const SystemContext = React.createContext<{
    setFavorite: Function;
    favoriteGames: number[];
    enabledPlaySound: boolean;
    gamesOrder: number[];
    betSettings: BetSettingStorage;
    updateBetSetting: Function;
    userStakeLevel: UserStakeLevel;
}>(null);

SystemContext.displayName = "SystemContext";

export const SystemContextProvider = SystemContext.Provider;
export const SystemContextConsumer = SystemContext.Consumer;
export const useSystemContext = () => React.useContext(SystemContext);
