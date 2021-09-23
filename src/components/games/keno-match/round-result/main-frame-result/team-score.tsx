import { useTranslation } from "next-i18next";
import React from "react";

import Styles from "./team-score.module.scss";

type Props = {
    teamName: string;
    score: number;
};

export default function TeamScore({ teamName, score }: Props) {
    const { t } = useTranslation();

    return (
        <div className={`${Styles["team-score"]} ${Styles[teamName]}`}>
            <span className={Styles["medal"]}></span>
            <span className={Styles["name"]}>{t(teamName)}:</span>
            <span className={Styles["score"]}>{score}</span>
        </div>
    );
}
