import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import SeDieDot from "../dot";
import { SettlementResult } from "../sedie";
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
    settlementResult: SettlementResult;
    gameState: GameState;
};

const renderIcons = (dots: boolean[]) => dots.map((isRed, index) => <SeDieDot key={index} red={isRed} />);

const SeDieBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;

    return (
        <div className={`${Styles["layout-sedie"]}`}>
            <div className={Styles["bet-choice-4red"]}>
                <BetOption
                    choice={Choices.red4}
                    odd={odds[Choices.red4]}
                    isHighlight={settlementResult[Choices.red4]}
                    gameState={gameState}
                >
                    {renderIcons([true, true, true, true])}
                </BetOption>
            </div>
            <div className={Styles["bet-choice-2red"]}>
                <BetOption
                    choice={Choices.red2}
                    odd={odds[Choices.red2]}
                    isHighlight={settlementResult[Choices.red2]}
                    gameState={gameState}
                >
                    <div className={Styles["wrapper-dots-2red"]}>{renderIcons([false, true, false, true])}</div>
                </BetOption>
            </div>
            <div className={Styles["bet-choice-4white"]}>
                <BetOption
                    choice={Choices.white4}
                    odd={odds[Choices.white4]}
                    isHighlight={settlementResult[Choices.white4]}
                    gameState={gameState}
                >
                    {renderIcons([false, false, false, false])}
                </BetOption>
            </div>
            <div className={Styles["bet-choice-3red"]}>
                <BetOption
                    choice={Choices.red3}
                    odd={odds[Choices.red3]}
                    isHighlight={settlementResult[Choices.red3]}
                    gameState={gameState}
                >
                    {renderIcons([false, true, true, true])}
                </BetOption>
            </div>
            <div className={Styles["bet-choice-1red"]}>
                <BetOption
                    choice={Choices.white3}
                    odd={odds[Choices.white3]}
                    isHighlight={settlementResult[Choices.white3]}
                    gameState={gameState}
                >
                    {renderIcons([true, false, false, false])}
                </BetOption>
            </div>
            <div className={Styles["bet-choice-even"]}>
                <BetOption
                    choice={Choices.even}
                    odd={odds[Choices.even]}
                    isHighlight={settlementResult[Choices.even]}
                    gameState={gameState}
                >
                    <div className={`${Styles["bet-choice-name"]} ${Styles.even}`}>{Choices.even}</div>
                </BetOption>
            </div>
            <div className={Styles["bet-choice-odd"]}>
                <BetOption choice={Choices.odd} odd={odds[Choices.odd]} isHighlight={settlementResult[Choices.odd]} gameState={gameState}>
                    <div className={`${Styles["bet-choice-name"]} ${Styles.odd}`}>{Choices.odd}</div>
                </BetOption>
            </div>
        </div>
    );
};

export default SeDieBetOptions;
