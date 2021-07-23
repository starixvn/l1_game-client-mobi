import React, { useContext } from "react";

import { PopupType, ViewMode } from "../../components/shared/game-base/type";

type GameActionsContextType = {
    placeBet: (betChoice: string, amount: number) => void;
    openPopup: (type: PopupType) => void;
    closePopup: () => void;
    registerMessageHandler: Function;
    unsubscribeMessageHandler: Function;
    openPlaceBetModal: Function;
    finishProcessingBet: Function;
    updateViewMode: (mode: ViewMode) => void;
    playAcceptedBetAnimation: (amount: number) => void;
    renderResultCollapse: () => React.ReactElement;
    setTabsScoreboardValue: Function;
};
const GameActionsContext = React.createContext<GameActionsContextType>(null);
GameActionsContext.displayName = "GameActionsContext";

export const GameActionsContextProvider = GameActionsContext.Provider;
export const GameActionsContextConsumer = GameActionsContext.Consumer;
export const useGameActionContext = () => useContext(GameActionsContext);
