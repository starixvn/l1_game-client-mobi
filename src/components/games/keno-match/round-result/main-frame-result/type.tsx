import { Result } from "../../type";

export interface HalfRoundResultProps{
    isFirstHalf: boolean;
    isShowScore: boolean;
    totalBlue: number;
    totalRed: number;
    result: Result;
}

export interface TeamProps {
    result: number[];
    teamName: string;
    className: string;
}

export default interface MainFrameResultProps {
    halfTimeResult: Result;
    fullTimeResult: Result;
    isShowH1Score: boolean;
    isShowFTScore: boolean;
}
