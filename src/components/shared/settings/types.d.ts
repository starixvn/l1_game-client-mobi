import { BetSetting } from "../bet-settings/type";

export interface Props {
    enabledSound: boolean;
    enabledNotification: boolean;
    onToggleSound: Function;
    onToggleNotification: Function;
    enabledOneClickBet?: boolean;
    updateBetSetting: Function;
    globalBetSetting: BetSetting;
    toggleGuideModal: Function;
    toggleHistoryModal: Function;
}
