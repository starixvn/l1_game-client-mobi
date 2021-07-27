import { TFunction } from "next-i18next";

export type BetHistoryItem = {
    time: string;
    phien: number;
    betwin: number;
    refund?: number;
    amount?: number;
    totalAmount?: number;
};

export type PropsBetContainer = {
    gameId: number;
    isRefund: boolean;
    renderResult: (bet: BetLogs, roundId: number, setShowResultDetail?: Function, setResultDetail?: Function, translate?: TFunction) => JSX.Element;
    translate?: TFunction;
    renderBet?: (bet: BetLogs, t: TFunction, mainOdds: object) => JSX.Element;
    gameName?: string;
    renderResultDetail?: (resultDetail: ResultDetail, translate: TFunction, gameName: string, closeModal: Function) => JSX.Element;
};

export type ResultDetail = {
    bet: BetLogs;
    roundId: number;
};

export type BetLogs = {
    betLogDetails?: [];
    betwin: number;
    freeBet?: boolean;
    name: string;
    phien: number;
    result: object;
    settlementResult: object;
    time: string;
    refund?: number;
    odds?: object;
    amount?: number;
};
