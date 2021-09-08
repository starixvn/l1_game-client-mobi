import React from "react";

import { UserStakeLevel } from "../../components/shared/game-base/type";

export const SystemContext = React.createContext<{
    setFavorite: Function;
    favoriteGames: number[];
    enabledPlaySound: boolean;
    gamesOrder: number[];
    userStakeLevel: UserStakeLevel;
    betValue: number;
    enabledQuickBet: boolean;
}>(null);

SystemContext.displayName = "SystemContext";

export const SystemContextProvider = SystemContext.Provider;
export const SystemContextConsumer = SystemContext.Consumer;
export const useSystemContext = () => React.useContext(SystemContext);
