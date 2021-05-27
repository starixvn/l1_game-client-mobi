import React, { useContext } from "react";

import { PopupType, ModeView } from "../../components/shared/game-base/type";

type GameActionsContextType = {
    placeBet: (betChoice: string, amount: number) => void;
    openPopup: (type: PopupType) => void;
    closePopup: () => void;
    registerMessageHandler: Function;
    unsubscribeMessageHandler: Function;
    openPlaceBetModal: Function;
    finishProcessingBet: Function;
    updateModeView: (mode: ModeView) => void;
    playAcceptedBetAnimation: (amount: number) => void;
    renderResultCollage: () => React.ReactElement;
};
const GameActionsContext = React.createContext<GameActionsContextType>(null);
GameActionsContext.displayName = "GameActionsContext";

export const GameActionsContextProvider = GameActionsContext.Provider;
export const GameActionsContextConsumer = GameActionsContext.Consumer;
export const useGameActionContext = () => useContext(GameActionsContext);
