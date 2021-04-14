import { useTranslation } from "next-i18next";
import React from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import BetOption from "../../../shared/bet-option";
import { GameState } from "../../../shared/game-base/type";
import SeDieDot from "../dot";
import { SettlementResult } from "../sedie";
import Styles from "./bet-options.module.scss";

const ChoiceIconMapper = {
    red4: [true, true, true, true],
    red2: [false, true, false, true],
    white4: [false, false, false, false],
    red3: [false, true, true, true],
    white3: [true, false, false, false],
    even: [],
    odd: [],
};

type Props = {
    settlementResult: SettlementResult;
    gameState: GameState;
};

const SeDieBetOptions: React.FunctionComponent<Props> = (props) => {
    const { gameState, settlementResult } = props;
    const { gameConfigs, gameSetting } = useGameContext();
    const { odds } = gameConfigs;
    const { t } = useTranslation([gameSetting.gameName.toLowerCase()]);

    const renderDots = (dots: boolean[]) => dots.map((isRed, index) => <SeDieDot key={index} red={isRed} />);

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
            {Object.keys(ChoiceIconMapper).map((choice) => (
                <div key={choice} className={Styles[`bet-choice-${choice}`]}>
                    <BetOption choice={choice} odd={odds[choice]} isHighlight={settlementResult[choice]} gameState={gameState}>
                        {ChoiceIconMapper[choice].length ? renderIcons(choice) : renderLabel(choice)}
                    </BetOption>
                </div>
            ))}
        </div>
    );
};

export default SeDieBetOptions;
