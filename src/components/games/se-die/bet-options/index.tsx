import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices, MainChoice } from "../se-die-helper";
import { SettlementResult } from "../sedie";
import Styles from "./bet-options.module.scss";

const ChoiceSeDieIconMapper = {
    red4: [true, true, true, true],
    red2: [true, true, false, false],
    white4: [false, false, false, false],
    red3: [true, true, true, false],
    white3: [true, false, false, false],
};

type Props = {
    choices: string[];
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
};

const SeDieBetOptions: React.FunctionComponent<Props> = (props) => {
    const { choices, gameState, settlementResult, isShowWinningEffect } = props;
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds, boostedChoices } = gameConfigs;
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    const renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? Choices.odd : Choices.even} size="large" />);

    const renderIcons = (choice: string) => {
        return choice === Choices.red2 ? (
            <div className={Styles["wrapper-dots-red2"]}>{renderDots(ChoiceSeDieIconMapper[choice])}</div>
        ) : (
            renderDots(ChoiceSeDieIconMapper[choice])
        );
    };

    const renderLabel = (choice: string) => <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{t(choice)}</div>;

    return (
        <div className="d-flex">
            <div className={` ${!choices.includes(Choices.red2) && Styles["mini"]} bet-options-container `}>
                {[Choices.odd, Choices.even].map((choice) => (
                    <BetOption
                        key={choice}
                        choice={choice}
                        odd={odds[choice]}
                        isHighlight={settlementResult[choice]}
                        gameState={gameState}
                        isShowWinningEffect={isShowWinningEffect}
                        isBoostedOdds={boostedChoices?.includes(choice)}
                        displayName={t(choice)}
                    />
                ))}
            </div>
            <div className={` ${!choices.includes(Choices.red2) && Styles["mini"]} bet-options-container col-bet-choices`}>
                {[Choices.red3, Choices.red4].map((choice) => (
                    <BetOption
                        key={choice}
                        choice={choice}
                        odd={odds[choice]}
                        isHighlight={settlementResult[choice]}
                        gameState={gameState}
                        isShowWinningEffect={isShowWinningEffect}
                        isBoostedOdds={boostedChoices?.includes(choice)}
                        displayName={t(choice)}
                    />
                ))}
            </div>
            <div className={` ${!choices.includes(Choices.red2) && Styles["mini"]} bet-options-container col-bet-choices`}>
                {[Choices.white3, Choices.white4].map((choice) => (
                    <BetOption
                        key={choice}
                        choice={choice}
                        odd={odds[choice]}
                        isHighlight={settlementResult[choice]}
                        gameState={gameState}
                        isShowWinningEffect={isShowWinningEffect}
                        isBoostedOdds={boostedChoices?.includes(choice)}
                        displayName={t(choice)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SeDieBetOptions;
