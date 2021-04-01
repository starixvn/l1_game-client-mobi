import React from "react";
import { Col, Row } from "reactstrap";

import BetContainer from "../../../shared/bet-container";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import SeDieDot from "../dot";
import SeDieResult from "../se-die-result";
import { Result, SettlementResult } from "../sedie";
import Styles from "./bet-options.module.scss";

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
    gameState: GameState;
};

const SeDieBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    return (
        <BetContainer gameState={props.gameState}>
            <div className={Styles["layout"]}>
                <div className={Styles["bet-choice-4red"]}>
                    <BetOption choice={Choices.red4} isHighlight={gameState == GameState.Waiting && settlementResult[Choices.red4]}>
                        <div className={Styles["list-dots"]}>
                            <SeDieDot red />
                            <SeDieDot red />
                            <SeDieDot red />
                            <SeDieDot red />
                        </div>
                    </BetOption>
                </div>
                <div className={Styles["bet-choice-2red"]}>
                    <BetOption choice={Choices.red2} isHighlight={gameState == GameState.Waiting && settlementResult[Choices.red2]}>
                        <div className={Styles.wrapper}>
                            <SeDieDot />
                            <SeDieDot red />
                            <SeDieDot />
                            <SeDieDot red />
                        </div>
                    </BetOption>
                </div>
                <div className={Styles["bet-choice-4white"]}>
                    <BetOption choice={Choices.white4} isHighlight={gameState == GameState.Waiting && settlementResult[Choices.white4]}>
                        <SeDieDot />
                        <SeDieDot />
                        <SeDieDot />
                        <SeDieDot />
                    </BetOption>
                </div>
                <div className={Styles["bet-choice-3red"]}>
                    <BetOption choice={Choices.red3} isHighlight={gameState == GameState.Waiting && settlementResult[Choices.red3]}>
                        <SeDieDot />
                        <SeDieDot red />
                        <SeDieDot red />
                        <SeDieDot red />
                    </BetOption>
                </div>
                <div className={Styles["bet-choice-1red"]}>
                    <BetOption choice={Choices.white3} isHighlight={gameState == GameState.Waiting && settlementResult[Choices.white3]}>
                        <SeDieDot red />
                        <SeDieDot />
                        <SeDieDot />
                        <SeDieDot />
                    </BetOption>
                </div>

                <div className={Styles["bet-choice-even"]}>
                    <BetOption choice={Choices.even} isHighlight={gameState == GameState.Waiting && settlementResult[Choices.even]}>
                        <div className={`${Styles.name} ${Styles.even}`}>{Choices.even}</div>
                    </BetOption>
                </div>
                <div className={Styles["bet-choice-odd"]}>
                    <BetOption choice={Choices.odd} isHighlight={gameState == GameState.Waiting && settlementResult[Choices.odd]}>
                        <div className={`${Styles.name} ${Styles.odd}`}>{Choices.odd}</div>
                    </BetOption>
                </div>
            </div>
            {[GameState.DisplayResult, GameState.BeforeStartRound].includes(gameState) && (
                <SeDieResult gameState={gameState} result={props.result} settlementResult={props.settlementResult}></SeDieResult>
            )}
        </BetContainer>
    );
};

export default SeDieBetOptions;
