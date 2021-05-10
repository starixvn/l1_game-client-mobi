import React, { useState } from "react";
import { Round } from "../../../../types";
import { GameState } from "../../../shared/game-base/type";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { useTranslation } from "next-i18next";
import { isTablet } from "react-device-detect";
import { MiniItemNext } from "../dot-next";
import { Tooltip } from "reactstrap";
import ContainerToolTip from "../../tool-tip";
import { PropsDot, Props } from "./types";
import Styles from "./styles.module.scss";

const RoundDotWrapper = <R, S>({ children, renderRoundDetail, targetName }: PropsDot<R, S>) => {
    const [isOpenTooltip, setIsOpenTooltip] = useState(false);
    const toggle = () => setIsOpenTooltip(!isOpenTooltip);

    return (
        <div className={Styles["dot-wrapper"]}>
            <div id={targetName}>{children}</div>
            <ContainerToolTip isOpen={isOpenTooltip} onClose={toggle}>
                <Tooltip trigger="click" placement="top" isOpen={isOpenTooltip} target={targetName} toggle={toggle}>
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
    let numberOfItems = isLockingBet() ? 20 : 21;
    if (isTablet) {
        numberOfItems = numberOfItems - 2;
    }
    const rounds = roundHistory.slice(0, numberOfItems).reverse();

    return (
        <div className={Styles["round-dot-wrapper"]}>
            {rounds.map((round: Round<R, S>, index: number) => (
                <RoundDotWrapper
                    key={round.roundId}
                    renderRoundDetail={renderRoundDetail(round, t)}
                    targetName={`${gameSetting.gameName.toLowerCase()}-${round.roundId}`}
                >
                    {renderGameDot(round, isLockingBet, index, numberOfItems)}
                </RoundDotWrapper>
            ))}
            {isLockingBet() && <MiniItemNext></MiniItemNext>}
        </div>
    );
};

export default ChainRoundHistory;
