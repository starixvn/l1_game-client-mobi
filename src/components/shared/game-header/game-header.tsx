import { useTranslation } from "next-i18next";
import React from "react";

import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import CountdownTimer from "../countdown-timer/countdown-timer";
import Styles from "./game-header.module.scss";

type Props = {
    gameName: string;
    roundId: number;
    gameState: number;
    remainingTime: number;
};

export default function GameHeader(props: Props) {
    const { gameName, roundId, gameState, remainingTime } = props;
    const { t } = useTranslation(gameName.toLowerCase());

    return (
        <div className={Styles.header}>
            <div className={Styles.left}>
                <div className={Styles.title}>{t(GameResourceKeys.GAME_NAME)}</div>
                <div className={Styles.round}>
                    {t(GameResourceKeys.ROUND)}: {roundId}
                </div>
            </div>
            <div className={Styles.right}>
                <CountdownTimer remainingTime={remainingTime} key={gameState}></CountdownTimer>
            </div>
        </div>
    );
}
