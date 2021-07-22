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
    renderResult: Function;
    translate?: Function;
    renderBet?: (bet: BetLogs, t: Function, mainOdds: object) => JSX.Element;
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
