export interface BetSettingStorage {
    [gameId: number]: {
        enabledQuickBet: boolean;
        betStake: number;
    };
}
