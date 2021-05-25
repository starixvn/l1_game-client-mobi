import React, { useEffect, useState, useRef } from "react";
import { useCountUp } from "react-countup";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/number-helper";
import { GameState } from "../game-base/type";
import Styles from "./bet-option.module.scss";
import DisplayChip from "./display-chip";
import { HighlightType, Props } from "./types";

const HighlightClassNameMapper = {
    [HighlightType.Background]: "highlight-winning",
    [HighlightType.Blink]: "winning-effect",
    [HighlightType.None]: "",
};

const BetOption: React.FunctionComponent<Props> = ({ gameState, choice, odd, children, isHighlight = false, isDisplayOdd = true }) => {
    const { totalBets, ownBets, gameSetting, isCompactMode, displayChips } = useGameContext();
    const { durations, gameName } = gameSetting;
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
    const wrapperRefBetOption = useRef<HTMLDivElement>(null);

    const actionByGameState = {
        [GameState.LockingBet]: () => {
            updateHighlightType(HighlightType.None);
        },
        [GameState.DisplayResult]: () => {
            setTimeout(() => updateHighlightType(HighlightType.Blink), durations.resultAnimation * 1000);
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

    useEffect(() => {
        return () => {
            wrapperRefBetOption.current = null;
        };
    }, []);

    const onClickBet = () => {
        enabledQuickBet ? gameActionContext.placeBet(choice, betValue) : openPlaceBetModal(choice);
    };

    const renderUserBetChips = () => {
        return chips.map((value, index) => <DisplayChip key={index} chipValue={value} chipKey={index}></DisplayChip>);
    };

    return (
        <div ref={wrapperRefBetOption} className={`${Styles.container} ${isCompactMode ? Styles["compact-mode"] : ""}`}>
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
                <div className={`${Styles["user-bet-chips"]} ${Styles[`${gameName}-${choice}`]}`}>{renderUserBetChips()}</div>
                <div className={Styles["own-bet"]}>
                    <span key={ownBets?.[choice]} className="heart-beat-animation d-inline-block">
                        {ownBets?.[choice] ? numberWithCommas(ownBets?.[choice]) : ""}
                    </span>
                </div>

                {isHighlight && highlightType === HighlightType.Blink && (
                    <div className={Styles["winning-effect"]}>
                        <span className={Styles["winning-line"]}></span>
                        <span className={Styles["winning-line"]}></span>
                        <span className={Styles["winning-line"]}></span>
                        <span className={Styles["winning-line"]}></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BetOption;
