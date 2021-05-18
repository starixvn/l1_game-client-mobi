import { useTranslation } from "next-i18next";
import React, { useState, useEffect } from "react";
import { Tooltip } from "reactstrap";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import ContainerToolTip from "../../tool-tip";
import { MiniItemNext } from "../dot-next";
import Styles from "./styles.module.scss";
import { Props, PropsDot } from "./types";

const RoundDotWrapper = <R, S>({ children, renderRoundDetail, targetName, gameState }: PropsDot<R, S>) => {
    const [isOpenTooltip, setIsOpenTooltip] = useState(false);
    const toggleTooltip = () => setIsOpenTooltip(!isOpenTooltip);
    useEffect(() => {
        if (gameState === GameState.LockingBet) {
            setIsOpenTooltip(false);
        }
    }, [gameState]);

    return (
        <div className={Styles["dot-wrapper"]}>
            <div id={targetName}>{children}</div>
            <ContainerToolTip isOpen={isOpenTooltip} onClose={toggleTooltip}>
                <Tooltip trigger="click" placement="top" isOpen={isOpenTooltip} target={targetName} toggle={toggleTooltip}>
                    {renderRoundDetail}
                </Tooltip>
            </ContainerToolTip>
        </div>
    );
};

const ChainRoundHistory = <R, S>(props: Props<R, S>) => {
    const { gameState, roundHistory, renderRoundDetail, renderGameDot } = props;
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const isLockingBet = () => gameState === GameState.LockingBet;
    const numberOfItems = isLockingBet() ? 20 : 21;
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <div className={Styles["round-dot-wrapper"]}>
            {rounds.map((round: Round<R, S>, index: number) => (
                <RoundDotWrapper
                    key={round.roundId}
                    renderRoundDetail={renderRoundDetail(round, t)}
                    targetName={`${gameSetting.gameName.toLowerCase()}-${round.roundId}`}
                    gameState={gameState}
                >
                    {renderGameDot(round, isLockingBet, index, numberOfItems)}
                </RoundDotWrapper>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </div>
    );
};

export default ChainRoundHistory;
