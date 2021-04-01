import React from "react";
import { Col, Row } from "reactstrap";

import { SettlementResult } from "./../fish-prawn-crab";
import BetContainer from "../../../shared/bet-container";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { Result } from "../fish-prawn-crab";
import Styles from "./bet-options.module.scss";

const Choices = {
    crab: "crab",
    fish: "fish",
    gourd: "gourd",
    prawn: "prawn",
    rooster: "rooster",
    stag: "stag",
};

type Props = {
    result: Result;
    settlementResult: SettlementResult;
    gameState: GameState;
};

const FishPrawnCrabBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <BetContainer gameState={gameState}>
            <Row noGutters className={Styles["first-row"]}>
                <Col xs="4">
                    <BetOption choice={Choices.stag} isHighlight={settlementResult[Choices.stag]}>
                        <div className={`${Styles.element} icon-nai`}></div>
                    </BetOption>
                </Col>
                <Col xs="4">
                    <BetOption choice={Choices.gourd} isHighlight={settlementResult[Choices.gourd]}>
                        <div className={`${Styles.element} icon-bau`}></div>
                    </BetOption>
                </Col>
                <Col xs="4">
                    <BetOption choice={Choices.rooster} isHighlight={settlementResult[Choices.rooster]}>
                        <div className={`${Styles.element} icon-ga`}></div>
                    </BetOption>
                </Col>
            </Row>

            <Row noGutters className={Styles["first-second"]}>
                <Col xs="4">
                    <BetOption choice={Choices.fish} isHighlight={settlementResult[Choices.fish]}>
                        <div className={`${Styles.element} icon-ca`}></div>
                    </BetOption>
                </Col>
                <Col xs="4">
                    <BetOption choice={Choices.crab} isHighlight={settlementResult[Choices.crab]}>
                        <div className={`${Styles.element} icon-cua`}></div>
                    </BetOption>
                </Col>
                <Col xs="4">
                    <BetOption choice={Choices.prawn} isHighlight={settlementResult[Choices.prawn]}>
                        <div className={`${Styles.element} icon-tom`}></div>
                    </BetOption>
                </Col>
            </Row>
        </BetContainer>
    );
};

export default FishPrawnCrabBetOptions;
