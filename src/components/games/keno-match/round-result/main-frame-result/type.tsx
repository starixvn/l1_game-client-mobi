import { Result } from "../../type";

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
