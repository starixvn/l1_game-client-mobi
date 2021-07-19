export interface QuickBetStorage {
    [gameId: number]: {
        enabledQuickBet: boolean;
        betStake: number;
    };
}
