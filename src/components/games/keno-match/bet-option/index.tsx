import React, { useEffect, useRef, useState } from "react";
import { GameState } from "../../../shared/game-base/type";
import { HighlightType } from "../../../shared/bet-option/types";
import BetOption from "../../../shared/bet-option";
import { KenoMatchGameStateEnum, KenoMatchGameState } from "../type";

interface KenoMatchBetOptionProps {
    choice: string;
    odd: number;
    isHighlight: boolean;
    children: React.ReactNode;
    isDisplayOdd?: boolean;
    gameState: GameState;
    isShowWinningEffect: boolean;
}

const KenoMatchBetOption: React.FunctionComponent<KenoMatchBetOptionProps> = ({
    gameState,
    choice,
    odd,
    children,
    isHighlight = false,
    isDisplayOdd = true,
    isShowWinningEffect = false,
}) => {
    const [highlightType, updateHighlightType] = useState<HighlightType>(HighlightType.None);

    useEffect(() => {
        const actionByGameState = {
            [KenoMatchGameStateEnum.ShowFullTimeSettlementResult]: () => {
                updateHighlightType(HighlightType.Background);
            },
            [KenoMatchGameStateEnum.ShowHalfTimeSettlementResult]: () => {
                updateHighlightType(HighlightType.Background);
            },
            [KenoMatchGameStateEnum.HalfTimeLockingBet]: () => {
                updateHighlightType(HighlightType.None);
            },
            [KenoMatchGameStateEnum.FullTimeLockingBet]: () => {
                updateHighlightType(HighlightType.None);
            },
            [KenoMatchGameStateEnum.FullTimePlacingBet]: () => {
                updateHighlightType(HighlightType.Background);
            },
            [KenoMatchGameStateEnum.HalfTimePlacingBet]: () => {
                updateHighlightType(HighlightType.Background);
            },
        };

        actionByGameState[gameState as KenoMatchGameState] && actionByGameState[gameState]();
    }, [gameState]);

    const betOptionProps = {
        choice,
        odd,
        isDisplayOdd,
        isHighlight,
        gameState,
        isShowWinningEffect,
        isHighlightTypeCustom: true,
        highlightTypeCustom: highlightType
    };

    return <BetOption {...betOptionProps}>{children}</BetOption>;
};

export default KenoMatchBetOption;
