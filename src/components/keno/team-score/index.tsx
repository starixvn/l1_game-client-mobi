import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../contexts/game-context/game-context";
import Styles from "./team-score.module.scss";

type Props = {
    teamName: string;
    score: number;
    isWin: boolean;
    customClassName?: string;
};

export default function TeamScore({ teamName, score, isWin, customClassName }: Props) {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={`${Styles["team-score"]} ${Styles[teamName]} ${customClassName ? Styles[customClassName] : ""}`}>
            {isWin && <span className={Styles["map-winning"]}></span>}
            <span className={Styles["name"]}>{t(teamName)}:</span>
            <span className={Styles["score"]}>{score}</span>
        </div>
    );
}
