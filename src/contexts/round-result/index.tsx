import React, { useContext } from "react";

type RoundResultContextType = {
    getRoundResultUrl: (gameId: number) => void;
};

const RoundResultContext = React.createContext<RoundResultContextType>(null);
export const RoundResultContextProvider = RoundResultContext.Provider;
export const RoundResultContextConsumer = RoundResultContext.Consumer;
export const useRoundResultContext = () => useContext(RoundResultContext);
