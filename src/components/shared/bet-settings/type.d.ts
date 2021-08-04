export interface BetSettingStorage {
    [gameId: number]: BetSetting;
}

export interface BetSetting {
    enabledQuickBet: boolean;
    betStake: number;
}
