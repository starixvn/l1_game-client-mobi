export interface Props {
    enabledSound: boolean;
    enabledNotification: boolean;
    onToggleSound: Function;
    onToggleNotification: Function;
    toggleGuideModal: Function;
    toggleHistoryModal: Function;
    favoriteGames: number[];
    offerGames: number[];
    updateFavoriteGames: Function;
    enabledQuickBet?: boolean;
    updateEnabledQuickBet?: Function;
    isShowQuickBet?: boolean;
}
