import React from "react";
import Styles from "./team-score.module.scss";

type Props = {
    teamName: string;
    score: number;
    isWin: boolean;
    customClassName?: string;
};

export default function TeamScore({ teamName, score, isWin, customClassName }: Props) {
    return (
        <div className={`${Styles["team-score"]} ${customClassName ? Styles[customClassName] : ""}`}>
            {isWin && <span className={Styles["map-winning"]}></span>}
            <span className={Styles["name"]}>{teamName}:</span>
            <span className={Styles["score"]}>{score}</span>
        </div>
    );
}
