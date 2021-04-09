import React, { useContext } from "react";

import { PopupType } from "../../components/shared/game-base/type";

type GameActionsContextType = {
    placeBet: (betChoice: string, amount: number) => void;
    getBetHistory: (page: number) => void;
    openPopup: (type: PopupType) => void;
    closePopup: () => void;
    handleMessage: Function;
};
const GameActionsContext = React.createContext<GameActionsContextType>(null);
GameActionsContext.displayName = "GameActionsContext";

export const GameActionsContextProvider = GameActionsContext.Provider;
export const GameActionsContextConsumer = GameActionsContext.Consumer;
export const useGameActionContext = () => useContext(GameActionsContext);
