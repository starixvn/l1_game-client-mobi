import React from "react";

export const SystemContext =
    React.createContext<{
        setFavorite: Function;
        checkFavorite: Function;
        betValue: number;
        enabledQuickBet: boolean;
        enabledPlaySound: boolean;
    }>(null);

SystemContext.displayName = "SystemContext";

export const SystemContextProvider = SystemContext.Provider;
export const SystemContextConsumer = SystemContext.Consumer;
export const useSystemContext = () => React.useContext(SystemContext);
