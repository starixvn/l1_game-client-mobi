import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState, ViewMode } from "../../../shared/game-base/type";
import { SettlementResult } from "../dragon-tiger";
import Styles from "./bet-options.module.scss";

const Choices = {
    dragon: "dragon",
    tiger: "tiger",
    tie: "tie",
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
};

const DragonTigerBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;
    const { gameConfigs, gameSetting, viewMode } = useGameContext();
    const { odds } = gameConfigs;
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={`bet-options-container ${Styles["layout-dragon-tiger"]}`}>
            <BetOption
                choice={Choices.dragon}
                odd={odds[Choices.dragon]}
                isHighlight={settlementResult[Choices.dragon]}
                gameState={gameState}
                isShowWinningEffect={isShowWinningEffect}
            >
                <div className={Styles["icon-group"]}>
                    <img src={`/static/images/dragon.svg?v=762021`} className="img-fluid" alt="dragon" />
                    <div className={Styles["text-dragon"]}>{t(Choices.dragon)}</div>
                </div>
            </BetOption>
            <BetOption
                choice={Choices.tiger}
                odd={odds[Choices.tiger]}
                isHighlight={settlementResult[Choices.tiger]}
                gameState={gameState}
                isShowWinningEffect={isShowWinningEffect}
            >
                <div className={Styles["icon-group"]}>
                    <img src={`/static/images/tiger.svg?v=762021`} className="img-fluid" alt="dragon" />
                    <div className={Styles["text-tiger"]}>{t(Choices.tiger)}</div>
                </div>
            </BetOption>
            {viewMode === ViewMode.full && (
                <div className={Styles["choice-tie"]}>
                    <BetOption
                        choice={Choices.tie}
                        odd={odds[Choices.tie]}
                        isHighlight={settlementResult[Choices.tie]}
                        gameState={gameState}
                        isShowWinningEffect={isShowWinningEffect}
                    >
                        <div className={Styles["text-tie"]}>{t(Choices.tie)}</div>
                    </BetOption>
                </div>
            )}
        </div>
    );
};

export default DragonTigerBetOptions;
