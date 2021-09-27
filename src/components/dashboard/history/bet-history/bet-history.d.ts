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
    renderResult?: (
        bet: BetLogs,
        roundId: number,
        setIsShowResultDetail?: Function,
        setResultDetail?: Function,
        t?: TFunction
    ) => JSX.Element;
    renderBet?: (bet: BetLogs, t: TFunction, mainOdds: object, gameName: string) => JSX.Element;
    renderResultDetail?: (
        resultDetail: ResultDetail,
        t: TFunction,
        closeModal: () => void,
        gameName: string,
        gameId?: number
    ) => JSX.Element;
    closeModal?: () => void;
    renderBetLogsDetails?: Function;
    nameHeaderOnTable?: string[];
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
    totalAmount?: number;
};

export type PropsResultDetail = {
    roundId: number;
    children: React.ReactNode;
    closeModal: () => void;
    gameName: string;
};
