import React, { useContext } from "react";

import { BetPosition, PopupType, ViewMode } from "../../components/shared/game-base/type";

type GameActionsContextType = {
    placeBet: (betChoice: string, amount: number, betPosition?: BetPosition) => void;
    openPopup: (type: PopupType) => void;
    closePopup: () => void;
    registerMessageHandler: Function;
    unsubscribeMessageHandler: Function;
    openPlaceBetModal: Function;
    finishProcessingBet: Function;
    updateViewMode: (mode: ViewMode) => void;
    playAcceptedBetAnimation: (amount: number) => void;
    renderResultCollapse: () => React.ReactElement;
    setActiveScoreboardTab: Function;
    updateStatusShowResult: Function;
};
const GameActionsContext = React.createContext<GameActionsContextType>(null);
GameActionsContext.displayName = "GameActionsContext";

export const GameActionsContextProvider = GameActionsContext.Provider;
export const GameActionsContextConsumer = GameActionsContext.Consumer;
export const useGameActionContext = () => useContext(GameActionsContext);
