import React, { useEffect, useRef, useState } from "react";
import { useCountUp } from "react-countup";

import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/number-helper";
import { GameState } from "../game-base/type";
import Styles from "./bet-option.module.scss";
import { HighlightType, Props } from "./types";

const HighlightClassNameMapper = {
    [HighlightType.Background]: "highlight-winning",
    [HighlightType.None]: "",
};

const convertStakeToString = (amount: number) => (amount ? numberWithCommas(amount) : "");

const BetOption: React.FunctionComponent<Props> = ({
    gameState,
    choice,
    odd,
    children,
    isHighlight = false,
    isDisplayOdd = true,
    isShowWinningEffect = false,
}) => {
    const { totalBets, ownBets, gameSetting } = useGameContext();
    const { id } = gameSetting;
    const { openPlaceBetModal, placeBet } = useGameActionContext();
    const { enabledQuickBet, betValue } = useSystemContext();
    const [highlightType, updateHighlightType] = useState<HighlightType>(HighlightType.None);
    const [totalBet, setTotalBet] = useState<number>(totalBets?.[choice] ?? 0);
    const { countUp, update } = useCountUp({ start: 0, end: 0 });
    const betChoiceRef = useRef<HTMLDivElement>(null);
    const totalBetRef = useRef<HTMLDivElement>(null);
    const [isFocusChoice, setIsFocusChoice] = useState<boolean>(false);

    useEffect(() => {
        const actionByGameState = {
            [GameState.LockingBet]: () => {
                updateHighlightType(HighlightType.None);
            },
            [GameState.InRound]: () => {
                updateHighlightType(HighlightType.Background);
            },
            [GameState.BeforeStartRound]: () => {
                updateHighlightType(HighlightType.Background);
            },
        };

        actionByGameState[gameState] && actionByGameState[gameState]();
        setTotalBet(totalBets[choice]);
        update(totalBet);
    }, [gameState, totalBets?.[choice]]);

    const onClickBet = (event: any) => {
        event.preventDefault();
        if (enabledQuickBet) {
            placeBet(choice, betValue);
        } else {
            setIsFocusChoice(true);
            const betOptionElement = totalBetRef.current.nextElementSibling;
            openPlaceBetModal(choice, removeBetChoiceFocus, betOptionElement, betChoiceRef.current);
        }
    };

    const removeBetChoiceFocus = () => {
        setIsFocusChoice(false);
    };

    return (
        <div className={Styles.container} ref={betChoiceRef}>
            <div
                className={`${Styles["bet-option"]} ${isFocusChoice ? Styles["focus"] : ""} ${
                    isHighlight && Styles[HighlightClassNameMapper[highlightType]]
                } ${isHighlight && isShowWinningEffect && Styles["winning-effect"]}`}
                onClick={onClickBet}
            >
                {isDisplayOdd && <div className={Styles.odd}>{odd ? `1:${odd}` : ""}</div>}

                <div className={Styles["total-bet"]} ref={totalBetRef}>
                    {gameState === GameState.BalancingBet ? convertStakeToString(+countUp) : convertStakeToString(totalBet)}
                </div>
                {children}
                <div className={Styles["own-bet"]}>
                    <span key={ownBets?.[choice]} className="d-inline-block">
                        {ownBets?.[choice] && numberWithCommas(ownBets?.[choice])}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BetOption;
