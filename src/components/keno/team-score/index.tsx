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
    const gameGroupClassName = gameSetting?.gameName.toLocaleLowerCase().replace(/[0-9]/g, "");

    return (
        <div className={`${Styles["team-score"]} ${customClassName ? Styles[customClassName] : ""} ${Styles[gameGroupClassName]}`}>
            {isWin && <span className={Styles["map-winning"]}></span>}
            <span className={Styles["name"]}>{teamName}:</span>
            <span className={Styles["score"]}>{isShowScore ? score : ""}</span>
        </div>
    );
}
