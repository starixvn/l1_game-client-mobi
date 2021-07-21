import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { Choices } from "../keno-pro-max-helper";
import { SettlementResult } from "../keno-pro-max";
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
    const { t } = useTranslation("kenopromax");

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

const KenoProMaxBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;

    return (
        <div className={`${Styles["layout-keno-pro-max"]}`}>
            {Object.keys(Choices).map((choice, index) => (
                <div key={index} className={Styles[`choice-${choice}`]}>
                    {renderBetOptionByChoice(choice, gameState, settlementResult, isShowWinningEffect)}
                </div>
            ))}
        </div>
    );
};

export default KenoProMaxBetOptions;
