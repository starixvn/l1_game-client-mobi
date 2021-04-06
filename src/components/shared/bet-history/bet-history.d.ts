export type Props = {
    betHistoryItem: any;
    renderResult: Function;
    renderBet: Function;
    isRefund: boolean;
};

export type BetHistoryItem = {
    time: string;
    phien: number;
    betwin: number;
    refund?: number;
    amount?: number;
    totalAmount?: number;
};

export type PropsBetContainer = {
    isRefund: boolean;
    renderResult: Function;
    renderBet: Function;
};

export type BetLogs = {
    betLogDetails: [];
    betwin: number;
    freeBet?: boolean;
    name: string;
    phien: number;
    result: object;
    settlementResult: object;
    time: string;
};
