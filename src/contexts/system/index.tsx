import React from "react";

import { UserStakeLevel } from "../../components/shared/game-base/type";
import { ChipSettings } from "../../components/dashboard/type";

type SystemContextType = {
    setFavorite: Function;
    favoriteGames: number[];
    enabledPlaySound: boolean;
    userStakeLevel: UserStakeLevel;
    betValue: number;
    enabledQuickBet: boolean;
    fractionalOddsFormat: boolean;
    chipSettings: ChipSettings;
};

export const SystemContext = React.createContext<Partial<SystemContextType>>({});

SystemContext.displayName = "SystemContext";

export const SystemContextProvider = SystemContext.Provider;
export const SystemContextConsumer = SystemContext.Consumer;
export const useSystemContext = () => React.useContext(SystemContext);
