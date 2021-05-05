import React from "react";
import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { useTranslation } from "next-i18next";
import { isTablet } from "react-device-detect";
import { MiniItemNext } from "../../../shared/round-history/item-next";
import RoundHistoryItem from "../../../shared/round-history/item";

type Props<R, S> = {
    roundHistory: Round<R, S>[];
    gameState: number;
    renderRoundDetail: (round: Round<R, S>, t: Function) => JSX.Element;
    renderGameDot: (round: Round<R, S>, isLockingBet: () => boolean, index: number, numberOfItems: number) => JSX.Element;
};
const ChainRoundHistory = <R, S>(props: Props<R, S>) => {
    const { gameState, roundHistory, renderRoundDetail, renderGameDot } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const isLockingBet = () => gameState === GameState.LockingBet;
    let numberOfItems = isLockingBet() ? 20 : 21;
    if (isTablet) {
        numberOfItems = numberOfItems - 2;
    }
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <>
            {rounds.map((round: Round<R, S>, index: number) => (
                <RoundHistoryItem
                    key={round.roundId}
                    renderRoundDetail={renderRoundDetail(round, t)}
                    targetName={`${gameSetting.gameName.toLowerCase()}-${round.roundId}`}
                >
                    {renderGameDot(round, isLockingBet, index, numberOfItems)}
                </RoundHistoryItem>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </>
    );
};

export default ChainRoundHistory;
