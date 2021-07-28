import { EventPosition } from "../game-base/type";

type BetChoiceInfo = {
    gameName: string;
    roundId: number;
    betChoice: string;
    odd: number;
};

export type PlaceBetModalProps = {
    isOpen: boolean;
    onPlaceBet: (betChoice: string, amount: number) => void;
    betChoiceInfo: BetChoiceInfo;
    onCloseModal: Function;
    eventPosition?: EventPosition;
    betContainerPosition?: any;
    gameBaseContainerRef?: any;
    gameHeaderRef?: any;
    removeBetChoiceFocus?: Function;
};