import React, { useContext } from "react";

import { GameState, ViewMode } from "../../components/shared/game-base/type";
import { GameContextModel } from "./game-context-type";

export const GameContext = React.createContext<GameContextModel>({
    roundId: 0,
    gameState: GameState.None,
    remainingTime: 0,
    totalBets: {},
    ownBets: {},
    gameSetting: null,
    gameConfigs: null,
    userStakeLevel: null,
    viewMode: ViewMode.full,
    displayChips: {},
    playResultAnimation: false,
    isShowBlink: false,
});
GameContext.displayName = "GameContext";

export const GameContextProvider = GameContext.Provider;
export const GameContextConsumer = GameContext.Consumer;
export const useGameContext = () => useContext(GameContext);
