import { Round, RoundKenoMatchBase } from "../../../../../types";

export interface Props<R, S> {
    roundHistory: Round<R, S>[] | RoundKenoMatchBase<R, S>[];
    getDotDetails: Function;
    conditionChangeDot?: Function;
    translateDotTextMapping?: object;
    getRoundValue?: Function;
    isShowBlink?: boolean;
}
