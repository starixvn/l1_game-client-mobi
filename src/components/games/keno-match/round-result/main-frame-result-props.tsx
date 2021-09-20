import { Result } from "../type";
import { SettlementResult } from "../type";

export interface HalfRoundResultProps {
    result: Result;
    headerText: string;
    className: string;
    active: boolean;
    gameName: string;
}

export interface TeamProps {
    result: number[];
    teamName: string;
    className: string;
}

export default interface MainFrameResultProps {
    halfTimeResult: Result;
    fullTimeResult: Result;
    isActiveLiveFullTime: boolean;
    gameName: string;
}

export interface AnimationResultProps extends MainFrameResultProps{
    playResultAnimation: boolean;
}

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
