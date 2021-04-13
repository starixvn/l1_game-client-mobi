import React, { useContext } from "react";

import { GameState } from "../../components/shared/game-base/type";
import { GameContextModel } from "./game-context-type";

export const GameContext = React.createContext<GameContextModel>({
    roundId: 0,
    gameState: GameState.None,
    remainingTime: 0,
    totalBets: {},
    ownBets: {},
    gameSetting: null,
    gameConfigs: null,
    betHistory: null,
    userStakeLevel: null, 
});
GameContext.displayName = "GameContext";

export const GameContextProvider = GameContext.Provider;
export const GameContextConsumer = GameContext.Consumer;
export const useGameContext = () => useContext(GameContext);
