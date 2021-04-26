import React, { useEffect, useState } from "react";

import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/NumberHelper";
import { GameState } from "../game-base/type";
import Styles from "./bet-option.module.scss";
import { HighlightType, Props } from "./types";

const HighlightClassNameMapper = {
    [HighlightType.Background]: "highlight-winning",
    [HighlightType.Blink]: "winning-effect",
    [HighlightType.None]: "",
};

const BetOption: React.FunctionComponent<Props> = ({ gameState, choice, odd, children, isHighlight = false, isDisplayOdd = true }) => {
    const { totalBets, ownBets, gameSetting } = useGameContext();
    const { openPlaceBetModal } = useGameActionContext();
    const { enabledQuickBet, betValue } = useSystemContext();
    const gameActionContext = useGameActionContext();
    const [highlightType, updateHighlightType] = useState<HighlightType>(HighlightType.None);

    const actionByGameState = {
        [GameState.DisplayResult]: () => {
            const highLightTime = gameSetting.durations.showResult - gameSetting.durations.highlightBeforeWaiting;

            setTimeout(() => updateHighlightType(HighlightType.Blink), highLightTime * 1000);
        },
        [GameState.Waiting]: () => {
            updateHighlightType(HighlightType.Blink);
        },
        [GameState.InRound]: () => {
            updateHighlightType(HighlightType.Background);
        },
        [GameState.BeforeStartRound]: () => {
            updateHighlightType(HighlightType.Background);
        },
    };

    useEffect(() => {
        actionByGameState[gameState] && actionByGameState[gameState]();
    }, [gameState]);

    function onClickBet() {
        enabledQuickBet ? gameActionContext.placeBet(choice, betValue) : openPlaceBetModal(choice);
    }

    return (
        <div className={Styles.container}>
            <div
                className={`${Styles["bet-option"]} ${isHighlight ? Styles[HighlightClassNameMapper[highlightType]] : ""}`}
                onClick={onClickBet}
            >
                {isDisplayOdd && <div className={Styles.odd}>{`1:${odd}`}</div>}
                <div className={Styles["total-bet"]}>{totalBets?.[choice] ? numberWithCommas(totalBets[choice]) : ""}</div>
                {children}
                <div className={Styles["own-bet"]}>{ownBets?.[choice] ? numberWithCommas(ownBets?.[choice]) : ""}</div>
            </div>
        </div>
    );
};

export default BetOption;
