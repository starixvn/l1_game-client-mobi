import { Round, RoundKenoMatchBase } from "../../../../../types";

export interface Props<R, S> {
    roundHistory: Round<R, S>[] | RoundKenoMatchBase<R, S>[];
    dotDetails?: DotDetails;
    getRoundValue?: Function;
    isShowBlink?: boolean;
}

interface DotDetails {
    getDotDetails?: Function;
    conditionChangeDot?: Function;
    translateDotTextMapping?: object;
    choice?: string[];
}
