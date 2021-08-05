import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import UserBetStats from "../../../shared/user-bet-stats";
import { SettlementResult } from "../../se-die/sedie";
import Styles from "./bet-options.module.scss";

type Props = {
    choices: string[];
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
    betPercentage: object;
};

const SpecialSeDieBetOptions: React.FC<Props> = (props) => {
    const { choices, settlementResult, gameState, isShowWinningEffect, betPercentage } = props;
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds } = gameConfigs;
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={`${Styles["layout-special-sedie"]}`}>
            {choices.map((choice) => (
                <BetOption
                    key={choice}
                    choice={choice}
                    odd={odds[choice]}
                    isHighlight={settlementResult[choice]}
                    gameState={gameState}
                    isShowWinningEffect={isShowWinningEffect}
                >
                    <div className={Styles[choice]}>
                        {t(choice)}
                        <UserBetStats value={betPercentage?.[choice]} />
                    </div>
                </BetOption>
            ))}
        </div>
    );
};

export default SpecialSeDieBetOptions;
