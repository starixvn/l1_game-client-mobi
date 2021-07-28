import { BetSetting } from "../bet-settings/type";

export interface Props {
    enabledSound: boolean;
    enabledNotification: boolean;
    onToggleSound: Function;
    onToggleNotification: Function;
    updateBetSetting: Function;
    globalBetSetting: BetSetting;
    toggleGuideModal: Function;
    toggleHistoryModal: Function;
    toggleFavoriteSetting: Function;
}
