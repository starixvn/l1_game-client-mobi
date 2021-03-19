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
        <Row className={Styles.container}>
            <Col xs={6}>
                <h3>{t(GameResourceKeys.GAME_NAME)}</h3>
                <p>
                    {t(GameResourceKeys.ROUND)}: {roundId}
                </p>
            </Col>
            <Col xs={6}>
                <CountdownTimer remainingTime={remainingTime} key={gameState}></CountdownTimer>
            </Col>
        </Row>
    );
}
