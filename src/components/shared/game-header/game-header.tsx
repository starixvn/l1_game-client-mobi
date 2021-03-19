import { useTranslation } from "next-i18next";
import React from "react";
import { Col, Row } from "reactstrap";

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
        <Row className={Styles.header}>
            <Col xs={6}>
                <div className={Styles.title}>{t(GameResourceKeys.GAME_NAME)}</div>
                <div className={Styles.round}>
                    {t(GameResourceKeys.ROUND)}: {roundId}
                </div>
            </Col>
            <Col xs={6} className={Styles.right}>
                <CountdownTimer remainingTime={remainingTime} key={gameState}></CountdownTimer>
            </Col>
        </Row>
    );
}
