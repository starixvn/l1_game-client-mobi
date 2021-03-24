import React from "react";
import { Col, Row } from "reactstrap";

import { Result, SettlementResult } from "./sedie";
import BetContainer from "../../shared/bet-container";
import BetOption from "../../shared/bet-option";
import { GameState } from "../../shared/game-base/type";
import SeDieResult from "./se-die-result";
import Styles from "./se-die-bet-options.module.scss";

const Choices = {
    odd: "odd",
    even: "even",
    red2: "red2",
    red3: "red3",
    red4: "red4",
    white3: "white3",
    white4: "white4",
};

type Props = {
    result: Result;
    settlementResult: SettlementResult;
    odds: {};
    gameState: GameState;
};

const SeDieDot = ({ className = "white" }) => {
    return <div className={`${Styles.dot} ${Styles[className]}`}></div>;
};

const SeDieBetOptions: React.FunctionComponent<Props> = (props) => {
    const { odds, gameState } = props;
    return (
        <BetContainer gameState={props.gameState}>
            <Row noGutters className={Styles["first-row"]}>
                <Col xs="5" className={Styles.col}>
                    <Row noGutters className={Styles.half}>
                        <BetOption choice={Choices.red4} odd={odds[Choices.red4]}>
                            <SeDieDot className="red" />
                            <SeDieDot className="red" />
                            <SeDieDot className="red" />
                            <SeDieDot className="red" />
                        </BetOption>
                    </Row>
                    <Row noGutters className={Styles.half}>
                        <BetOption choice={Choices.red3} odd={odds[Choices.red3]}>
                            <SeDieDot />
                            <SeDieDot className="red" />
                            <SeDieDot className="red" />
                            <SeDieDot className="red" />
                        </BetOption>
                    </Row>
                </Col>
                <Col xs="2">
                    <BetOption choice={Choices.red2} odd={odds[Choices.red2]}>
                        <div className={Styles.wrapper}>
                            <SeDieDot />
                            <SeDieDot className="red" />
                            <SeDieDot />
                            <SeDieDot className="red" />
                        </div>
                    </BetOption>
                </Col>
                <Col xs="5">
                    <Row noGutters className={Styles.half}>
                        <BetOption choice={Choices.white4} odd={odds[Choices.white4]}>
                            <SeDieDot />
                            <SeDieDot />
                            <SeDieDot />
                            <SeDieDot />
                        </BetOption>
                    </Row>
                    <Row noGutters className={Styles.half}>
                        <BetOption choice={Choices.white3} odd={odds[Choices.white3]}>
                            <SeDieDot className="red" />
                            <SeDieDot />
                            <SeDieDot />
                            <SeDieDot />
                        </BetOption>
                    </Row>
                </Col>
            </Row>
            <Row noGutters className={Styles["second-row"]}>
                <Col xs="6">
                    <BetOption choice={Choices.odd} odd={odds[Choices.odd]}>
                        <div className={`${Styles.name} ${Styles.odd}`}>{Choices.odd}</div>
                    </BetOption>
                </Col>
                <Col xs="6">
                    <BetOption choice={Choices.even} odd={odds[Choices.even]}>
                        <div className={`${Styles.name} ${Styles.even}`}>{Choices.even}</div>
                    </BetOption>
                </Col>
            </Row>
            {gameState === GameState.DisplayResult && (
                <SeDieResult result={props.result} settlementResult={props.settlementResult}></SeDieResult>
            )}
        </BetContainer>
    );
};

export default SeDieBetOptions;
