import React, { useContext } from "react";

import { GameContextModel } from "./game-context-type";

export const GameContext = React.createContext<GameContextModel>({
    updateGameState: () => {},
    placeBet: () => {},
    totalBets: {},
    ownBets: {},
    gameName: "",
    roundId: 0,
    gameConfigs: null,
});
GameContext.displayName = "GameContext";

export const GameContextProvider = GameContext.Provider;
export const GameContextConsumer = GameContext.Consumer;
export const useGameContext = () => useContext(GameContext);
