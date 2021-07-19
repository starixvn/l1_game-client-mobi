import React from "react";

export const SystemContext = React.createContext<{
    setFavorite: Function;
    checkFavorite: Function;
    enabledPlaySound: boolean;
    gamesOrder: number[];
}>(null);

SystemContext.displayName = "SystemContext";

export const SystemContextProvider = SystemContext.Provider;
export const SystemContextConsumer = SystemContext.Consumer;
export const useSystemContext = () => React.useContext(SystemContext);
