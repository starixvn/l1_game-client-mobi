import React from "react";
import { BetSettingStorage } from "../../components/shared/bet-settings/type";

export const SystemContext = React.createContext<{
    setFavorite: Function;
    checkFavorite: Function;
    enabledPlaySound: boolean;
    gamesOrder: number[];
    betSettings: BetSettingStorage;
    updateBetSetting: Function;
}>(null);

SystemContext.displayName = "SystemContext";

export const SystemContextProvider = SystemContext.Provider;
export const SystemContextConsumer = SystemContext.Consumer;
export const useSystemContext = () => React.useContext(SystemContext);
