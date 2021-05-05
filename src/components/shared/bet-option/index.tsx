import React, { useEffect, useRef, useState } from "react";
import { useCountUp } from "react-countup";
import { gameConfigs } from "../../../../configuration";

import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/NumberHelper";
import { GameState } from "../game-base/type";
import Styles from "./bet-option.module.scss";
import DisplayChip from "./DisplayChip";
import { HighlightType, Props } from "./types";

const HighlightClassNameMapper = {
    [HighlightType.Background]: "highlight-winning",
    [HighlightType.Blink]: "winning-effect",
    [HighlightType.None]: "",
};

const BetOption: React.FunctionComponent<Props> = ({ gameState, choice, odd, children, isHighlight = false, isDisplayOdd = true }) => {
    const { totalBets, ownBets, gameSetting, isCompactMode, displayChips } = useGameContext();
    const chips = displayChips[choice] ?? [];
    const { openPlaceBetModal } = useGameActionContext();
    const { enabledQuickBet, betValue } = useSystemContext();
    const gameActionContext = useGameActionContext();
    const [highlightType, updateHighlightType] = useState<HighlightType>(HighlightType.None);
    const [totalBet, setTotalBet] = useState<number>(totalBets?.[choice] ?? 0);
    const { countUp, update } = useCountUp({
        start: 0,
        end: 0,
    });

    const actionByGameState = {
        [GameState.LockingBet]: () => {
            updateHighlightType(HighlightType.None);
        },
        [GameState.DisplayResult]: () => {
            setTimeout(() => updateHighlightType(HighlightType.Blink), gameSetting.durations.resultAnimation * 1000);
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
        setTotalBet(totalBets[choice]);
        update(totalBet);
    }, [gameState, totalBets?.[choice]]);

    const onClickBet = () => {
        enabledQuickBet ? gameActionContext.placeBet(choice, betValue) : openPlaceBetModal(choice);
    };

    const renderUserBetChips = () => {
        return chips.map((value, index) => <DisplayChip chipValue={value} chipKey={index}></DisplayChip>);
    };

    return (
        <div className={`${Styles.container} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
            <div
                className={`${Styles["bet-option"]} ${isHighlight ? Styles[HighlightClassNameMapper[highlightType]] : ""}`}
                onClick={onClickBet}
            >
                {isDisplayOdd && <div className={Styles.odd}>{odd ? `1:${odd}` : ""}</div>}
                <div className={Styles["total-bet"]}>
                    {gameState === GameState.BalancingBet
                        ? countUp
                            ? numberWithCommas(+countUp)
                            : ""
                        : totalBet
                        ? numberWithCommas(totalBet)
                        : ""}
                </div>
                {children}
                <div className={`${Styles["user-bet-chips"]} ${Styles[`${gameSetting.gameName}-${choice}`]}`}>{renderUserBetChips()}</div>
                <div className={Styles["own-bet"]}>{ownBets?.[choice] ? numberWithCommas(ownBets?.[choice]) : ""}</div>
            </div>
        </div>
    );
};

export default BetOption;
