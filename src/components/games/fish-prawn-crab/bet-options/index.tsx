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

const IconMapper = {
    crab: "cua",
    fish: "ca",
    gourd: "bau",
    prawn: "tom",
    rooster: "ga",
    stag: "nai",
};

type Props = {
    result: Result;
    settlementResult: SettlementResult;
    gameState: GameState;
};

const renderBetOptionByChoice = (choice: string, gameState: GameState, settlementResult: SettlementResult) => {
    const isHighLight = gameState === GameState.Waiting && settlementResult[choice];

    return (
        <BetOption choice={choice} isHighlight={isHighLight}>
            <div className={`${Styles.element} icon-${IconMapper[choice]}`}></div>
        </BetOption>
    );
};

const FishPrawnCrabBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <BetContainer gameState={gameState}>
            <Row noGutters className={Styles["first-row"]}>
                <Col xs="4">{renderBetOptionByChoice(Choices.stag, gameState, settlementResult)}</Col>
                <Col xs="4">{renderBetOptionByChoice(Choices.gourd, gameState, settlementResult)}</Col>
                <Col xs="4">{renderBetOptionByChoice(Choices.rooster, gameState, settlementResult)}</Col>
            </Row>

            <Row noGutters className={Styles["first-second"]}>
                <Col xs="4">{renderBetOptionByChoice(Choices.fish, gameState, settlementResult)}</Col>
                <Col xs="4">{renderBetOptionByChoice(Choices.crab, gameState, settlementResult)}</Col>
                <Col xs="4">{renderBetOptionByChoice(Choices.prawn, gameState, settlementResult)}</Col>
            </Row>
        </BetContainer>
    );
};

export default FishPrawnCrabBetOptions;
