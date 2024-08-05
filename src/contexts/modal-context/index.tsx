import React, { useContext, useReducer } from "react";

type ModalContextType = {
    enabledPromotionTournament: boolean;
};

export enum ModalEventActionType {
    TogglePromotionTournamentModal = "toggle-promotion-tournament-modal",
}

export const modalContextInitialValues = {
    enabledPromotionTournament: false,
};

export function ModalContextProvider({ children }) {
    const [placeBetContextModel, dispatch] = useReducer(modalReducer, modalContextInitialValues);

    return (
        <ModalContext.Provider value={placeBetContextModel}>
            <ModalDispatchContext.Provider value={dispatch}>{children}</ModalDispatchContext.Provider>
        </ModalContext.Provider>
    );
}

export const ModalContext = React.createContext<Partial<ModalContextType>>(modalContextInitialValues);
ModalContext.displayName = "ModalContext";

const ModalDispatchContext = React.createContext({});

export const useModalDispatch = () => {
    return useContext(ModalDispatchContext) as any;
};
export const useModalContext = () => React.useContext(ModalContext);

const modalReducer = (state: ModalContextType, action: { type: ModalEventActionType; payload: boolean }) => {
    const { type, payload } = action;

    if (type === ModalEventActionType.TogglePromotionTournamentModal) {
        return { ...state, enabledPromotionTournament: payload };
    }
    return state;
};
