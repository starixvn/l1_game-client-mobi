import { TFunction } from "next-i18next";
import { Result } from "../../type";

export interface HalfRoundResultProps {
    result: Result;
    isFirstHalf: boolean;
}

export interface TeamProps {
    result: number[];
    teamName: string;
    className: string;
}

export default interface MainFrameResultProps {
    halfTimeResult: Result;
    fullTimeResult: Result;
}
