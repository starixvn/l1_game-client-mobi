import { useTranslation } from "next-i18next";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import { SettlementResult } from "../keno-power";
import { MainChoices, SumChoices, TeamChoices } from "../keno-power-helper";
import Styles from "./bet-options.module.scss";

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
    isShowWinningEffect: boolean;
};

const renderBetOptionByChoice = (
    choice: string,
    label: string,
    odd: number,
    gameState: GameState,
    isHighLight: boolean,
    isShowWinningEffect: boolean
) => {
    return (
        <BetOption
            choice={choice}
            odd={odd}
            isDisplayOdd={true}
            isHighlight={isHighLight}
            gameState={gameState}
            isShowWinningEffect={isShowWinningEffect}
        >
            <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{label}</div>
        </BetOption>
    );
};

const RenderBetOptionsGroup = (choices: string[], gameState: GameState, settlementResult: SettlementResult, isShowWinningEffect: boolean) =>
    choices.map((choice) => {
        const { gameConfigs, gameSetting } = useGameContext();
        const { odds } = gameConfigs;
        const isHighLight = gameState !== GameState.LockingBet && settlementResult[choice];
        const { t } = useTranslation(gameSetting.gameName.toLowerCase());

        return (
            <div key={`choice-${choice}`} className={Styles[`choice-${choice}`]}>
                {renderBetOptionByChoice(choice, t(choice), odds[choice], gameState, isHighLight, isShowWinningEffect)}
            </div>
        );
    });

const KenoPowerOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult, isShowWinningEffect } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    return (
        <div className={`${Styles["layout-keno-pro-max"]}`}>
            {RenderBetOptionsGroup(MainChoices, gameState, settlementResult, isShowWinningEffect)}
            <div className={Styles["sum-choice-area"]}>{t("sum")}</div>
            {RenderBetOptionsGroup(SumChoices, gameState, settlementResult, isShowWinningEffect)}
            <div className={Styles["team-choice-area"]}>
                <span>{t("blue")}</span>
                <span>{t("red")}</span>
            </div>
            {RenderBetOptionsGroup(TeamChoices, gameState, settlementResult, isShowWinningEffect)}
        </div>
    );
};

export default KenoPowerOptions;
