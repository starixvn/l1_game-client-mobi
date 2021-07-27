import React, { useEffect, useState, useRef } from "react";
import { useCountUp } from "react-countup";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";

import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { numberWithCommas } from "../../../helpers/number-helper";
import { GameState } from "../game-base/type";
import { BetSettingStorage } from "../bet-settings/type";
import Styles from "./bet-option.module.scss";
import { HighlightType, Props } from "./types";

const betSettingStorageKey = SessionStorageKeys.betSetting;
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
    const [highlightType, updateHighlightType] = useState<HighlightType>(HighlightType.None);
    const [totalBet, setTotalBet] = useState<number>(totalBets?.[choice] ?? 0);
    const { countUp, update } = useCountUp({ start: 0, end: 0 });
    const betChoiceRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        actionByGameState[gameState] && actionByGameState[gameState]();
        setTotalBet(totalBets[choice]);
        update(totalBet);
    }, [gameState, totalBets?.[choice]]);

    const onClickBet = (event: any) => {
        const betSettingStorage = getSessionStorageItem<BetSettingStorage>(betSettingStorageKey) ?? {};
        const betSetting = betSettingStorage[id];
        const betValue = betSetting?.betStake ?? 1;
        const enabledQuickBet = betSetting?.enabledQuickBet;
        const {top, bottom, left, right, height, width, x, y} = event.currentTarget.getBoundingClientRect();

        enabledQuickBet ? placeBet(choice, betValue) : openPlaceBetModal(choice, {top, left,  bottom, right, height, width, x, y});
    };

    return (
        <div className={Styles.container}>
            <div
                className={`${Styles["bet-option"]} ${isHighlight && Styles[HighlightClassNameMapper[highlightType]]} ${
                    isHighlight && isShowWinningEffect && Styles["winning-effect"]
                }`}
                onClick={onClickBet}
                ref={betChoiceRef}
            >
                {isDisplayOdd && <div className={Styles.odd}>{odd ? `1:${odd}` : ""}</div>}

                <div className={Styles["total-bet"]}>
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
