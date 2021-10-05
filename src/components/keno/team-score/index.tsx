import React from "react";
import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./team-score.module.scss";

type Props = {
    teamName: string;
    score: number;
    isWin: boolean;
    isShowScore?: boolean;
    customClassName?: string;
};

export default function TeamScore({ teamName, score, isWin, isShowScore, customClassName }: Props) {
    const { gameSetting } = useGameContext();

    return (
        <div
            className={`${Styles["team-score"]} ${customClassName ? Styles[customClassName] : ""} ${
                Styles[gameSetting?.gameName.toLocaleLowerCase()]
            }`}
        >
            {isWin && <span className={Styles["map-winning"]}></span>}
            <span className={Styles["name"]}>{teamName}:</span>
            <span className={Styles["score"]}>{isShowScore ? score : ""}</span>
        </div>
    );
}
