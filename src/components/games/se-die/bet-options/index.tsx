import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState, ViewMode } from "../../../shared/game-base/type";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices, MainChoice, SeDieSpecialId } from "../se-die-helper";
import { SettlementResult } from "../sedie";
import Styles from "./bet-options.module.scss";

const ChoiceSeDieIconMapper = {
    red4: [true, true, true, true],
    red2: [false, false, true, true],
    white4: [false, false, false, false],
    red3: [false, true, true, true],
    white3: [false, false, false, true],
};

const ChoiceMiniSeDieIconMapper = {
    red4: [true, true, true, true],
    white4: [false, false, false, false],
    red3: [false, true, true, true],
    white3: [false, false, false, true],
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    betPercentage: object;
};

const renderStatisticUserBet = (betPercentage: object, choice: string) => {
    return (
        <div className={Styles["statistic-user-bet"]}>
            <span className={`icon-user-group ${Styles["user-group"]}`}></span>
            <span className={Styles["number"]}>{betPercentage && betPercentage[choice] ? betPercentage[choice] : 0}%</span>
        </div>
    );
};

const choiceIcons = (gameId: number) => {
    switch (gameId) {
        case 9:
            return ChoiceMiniSeDieIconMapper;
        case 24:
            return {};
        default:
            return ChoiceSeDieIconMapper;
    }
};

const getClassLayout = (gameId: number) => {
    switch (gameId) {
        case 9:
            return "layout-sedie-mini";
        case 24:
            return "layout-sedie-special";
        default:
            return "";
    }
};

const SeDieBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect, betPercentage } = props;
    const { gameConfigs, gameSetting, viewMode } = useGameContext();
    const { odds } = gameConfigs;
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    const renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? Choices.odd : Choices.even} size="large" />);

    const renderIcons = (choice: string) => {
        return choice === "red2" ? (
            <div className={Styles["wrapper-dots-red2"]}>{renderDots(ChoiceSeDieIconMapper[choice])}</div>
        ) : (
            renderDots(ChoiceSeDieIconMapper[choice])
        );
    };

    const renderLabel = (choice: string, children) => (
        <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>
            {t(choice)}
            {children}
        </div>
    );

    return (
        <div className={`${Styles["layout-sedie"]} ${Styles[getClassLayout(gameSetting.id)]}`}>
            {viewMode === ViewMode.full &&
                Object.keys(choiceIcons(gameSetting.id)).map((choice) => (
                    <div key={choice} className={Styles[`bet-choice-${choice}`]}>
                        <BetOption
                            choice={choice}
                            odd={odds[choice]}
                            isHighlight={settlementResult[choice]}
                            gameState={gameState}
                            isShowWinningEffect={isShowWinningEffect}
                        >
                            {renderIcons(choice)}
                        </BetOption>
                    </div>
                ))}

            {MainChoice.map((choice) => (
                <div key={choice} className={Styles[`bet-choice-${choice}`]}>
                    <BetOption
                        choice={choice}
                        odd={odds[choice]}
                        isHighlight={settlementResult[choice]}
                        gameState={gameState}
                        isShowWinningEffect={isShowWinningEffect}
                    >
                        {renderLabel(choice, SeDieSpecialId.includes(gameSetting.id) && renderStatisticUserBet(betPercentage, choice))}
                    </BetOption>
                </div>
            ))}
        </div>
    );
};

export default SeDieBetOptions;
