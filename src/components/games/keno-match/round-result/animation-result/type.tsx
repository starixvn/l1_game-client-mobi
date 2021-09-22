import { SettlementResult } from "../../type";
import { HalfRoundResultProps } from "../main-frame-result/type";

export interface HalfRoundAnimationResultProps extends HalfRoundResultProps {
    settlementResult: SettlementResult;
    showSettlement: boolean;
    progressBarStyle: string;
}

export interface TeamWithAnimationProps {
    result: number[];
    teamName: string[];
    gameName: string;
    total: number;
}

export interface HalfRoundSettlementProps {
    settlementResult: SettlementResult;
    gameName: string;
    isActiveLiveFullTime: boolean;
}
