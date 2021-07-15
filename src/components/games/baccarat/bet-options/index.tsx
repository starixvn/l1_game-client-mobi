import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState, ViewMode } from "../../../shared/game-base/type";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices } from "../baccarat-helper";
import { SettlementResult } from "../baccarat";
import Styles from "./bet-options.module.scss";

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
};

const renderBetOptionByChoice = (
    choice: string,
    gameState: GameState,
    settlementResult: SettlementResult,
    isShowWinningEffect: boolean
) => {
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds } = gameConfigs;
    const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    const renderLabel = (choice: string) => <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{t(choice)}</div>;

    return (
        <BetOption
            choice={choice}
            odd={odds[choice]}
            isDisplayOdd={false}
            isHighlight={isHighLight}
            gameState={gameState}
            isShowWinningEffect={isShowWinningEffect}
        >
            {renderLabel(choice)}
        </BetOption>
    );
};

const BaccaratBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;
    const { gameConfigs, gameSetting, viewMode } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    const renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? Choices.big : Choices.small} size="large" />);

    const renderLabel = (choice: string) => <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{t(choice)}</div>;

    return (
        <div className={`${Styles["layout-keno-pro-max"]}`}>
            {Object.keys(Choices).map((choice, index) => (
                <div key={index}>{renderBetOptionByChoice(choice, gameState, settlementResult, isShowWinningEffect)}</div>
            ))}
        </div>
    );
};

export default BaccaratBetOptions;
