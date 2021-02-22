import React from "react";
import Styles from "./game-header.module.scss";
import { Row, Col, Container } from "reactstrap";
import CountdownTimer from "../countdown-timer/countdown-timer";

type Props = {
  gameName: string;
  roundId: number;
  gameState: number;
  remainingTime: number;
};

export default function GameHeader(props: Props) {
  const { gameName, roundId, gameState, remainingTime } = props;

  return (
    <Row className={Styles.container}>
      <Col xs={6}>
        <h3>{gameName}</h3>
        <p>Draw No. {roundId}</p>
      </Col>
      <Col xs={6}>
        <CountdownTimer
          remainingTime={remainingTime}
          key={gameState}
        ></CountdownTimer>
      </Col>
    </Row>
  );
}
