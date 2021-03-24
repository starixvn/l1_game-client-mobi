import React from "react";
import { GameContextModel } from "./game-context-type";

export const GameContext = React.createContext<GameContextModel>(null);
GameContext.displayName = "SocketContext";

export const GameContextProvider = GameContext.Provider;
export const GameContextConsumer = GameContext.Consumer;
export const useGameContext = () => React.useContext(GameContext);
