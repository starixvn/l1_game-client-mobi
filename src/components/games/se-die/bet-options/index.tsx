import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState, ViewMode } from "../../../shared/game-base/type";
import { RoundDot } from "../../../shared/round-history/dot";
import { Choices, MainChoice } from "../se-die-helper";
import { SettlementResult } from "../sedie";
import Styles from "./bet-options.module.scss";

const ChoiceIconMapper = {
    red4: [true, true, true, true],
    red2: [false, false, true, true],
    white4: [false, false, false, false],
    red3: [false, true, true, true],
    white3: [false, false, false, true],
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
};

const SeDieBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    const { gameConfigs, gameSetting, viewMode } = useGameContext();
    const { odds } = gameConfigs;
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());

    const renderDots = (dots: boolean[]) =>
        dots.map((isRed, index) => <RoundDot key={index} choice={isRed ? Choices.odd : Choices.even} />);

    const renderIcons = (choice: string) => {
        return choice === "red2" ? (
            <div className={Styles["wrapper-dots-red2"]}>{renderDots(ChoiceIconMapper[choice])}</div>
        ) : (
            renderDots(ChoiceIconMapper[choice])
        );
    };

    const renderLabel = (choice: string) => <div className={`${Styles["bet-choice-name"]} ${Styles[choice]}`}>{t(choice)}</div>;

    return (
        <div className={`${Styles["layout-sedie"]}`}>
            {viewMode === ViewMode.full &&
                Object.keys(ChoiceIconMapper).map((choice) => (
                    <div key={choice} className={Styles[`bet-choice-${choice}`]}>
                        <BetOption choice={choice} odd={odds[choice]} isHighlight={settlementResult[choice]} gameState={gameState}>
                            {renderIcons(choice)}
                        </BetOption>
                    </div>
                ))}

            {MainChoice.map((choice) => (
                <div key={choice} className={Styles[`bet-choice-${choice}`]}>
                    <BetOption choice={choice} odd={odds[choice]} isHighlight={settlementResult[choice]} gameState={gameState}>
                        {renderLabel(choice)}
                    </BetOption>
                </div>
            ))}
        </div>
    );
};

export default SeDieBetOptions;
