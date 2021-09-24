import React, { useEffect, useState } from "react";

import BetOption from "../../../shared/bet-option";
import { HighlightType } from "../../../shared/bet-option/types";
import { GameState } from "../../../shared/game-base/type";
import { KenoMatchGameState, KenoMatchGameStateEnum } from "../type";

interface KenoMatchBetOptionProps {
    choice: string;
    odd: number;
    isHighlight: boolean;
    children: React.ReactNode;
    isDisplayOdd?: boolean;
    gameState: GameState;
    isShowWinningEffect: boolean;
    bettypeName: string;
}

const KenoMatchBetOption: React.FunctionComponent<KenoMatchBetOptionProps> = ({
    gameState,
    choice,
    odd,
    children,
    bettypeName,
    isHighlight = false,
    isDisplayOdd = true,
    isShowWinningEffect = false,
}) => {
    const [highlightType, updateHighlightType] = useState<HighlightType>(HighlightType.None);

    useEffect(() => {
        const actionByGameState = {
            [KenoMatchGameStateEnum.ShowSettlementResult]: () => {
                updateHighlightType(HighlightType.Background);
            },
            [KenoMatchGameStateEnum.FullTimePlacingBet]: () => {
                updateHighlightType(HighlightType.Background);
            },
            [KenoMatchGameStateEnum.HalfTimePlacingBet]: () => {
                updateHighlightType(HighlightType.Background);
            },
            [KenoMatchGameStateEnum.LockingBet]: () => {
                updateHighlightType(HighlightType.None);
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
        highlightTypeCustom: highlightType,
        isShowBettype: true,
        bettypeName,
    };

    return <BetOption {...betOptionProps}>{children}</BetOption>;
};

export default KenoMatchBetOption;
