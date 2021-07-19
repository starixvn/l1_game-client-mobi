import React, { useEffect, useState } from "react";
import { useCountUp } from "react-countup";
import { getSessionStorageItem, SessionStorageKeys } from "../../../common/session-storage";

import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import { numberWithCommas } from "../../../helpers/number-helper";
import { GameState } from "../game-base/type";
import { QuickBetStorage } from "../quick-bet-modal/type";
import Styles from "./bet-option.module.scss";
import DisplayChip from "./display-chip";
import { HighlightType, Props } from "./types";

const quickBetStorageKey = SessionStorageKeys.quickBet;
const HighlightClassNameMapper = {
    [HighlightType.Background]: "highlight-winning",
    [HighlightType.None]: "",
};

const convertStakeToString = (amount: number) => (amount ? numberWithCommas(amount) : "");
const getUserBetChipClass = (gameName: string, choice: string) => {
    const distinctStyle = `${gameName}-${choice}`;

    return `${Styles["user-bet-chips"]} ${Styles[distinctStyle]}`;
};

const BetOption: React.FunctionComponent<Props> = ({
    gameState,
    choice,
    odd,
    children,
    isHighlight = false,
    isDisplayOdd = true,
    isShowWinningEffect = false,
}) => {
    const { totalBets, ownBets, gameSetting, displayChips } = useGameContext();
    const { gameName, id } = gameSetting;
    const chips = displayChips[choice] ?? [];
    const { openPlaceBetModal, placeBet } = useGameActionContext();
    const [highlightType, updateHighlightType] = useState<HighlightType>(HighlightType.None);
    const [totalBet, setTotalBet] = useState<number>(totalBets?.[choice] ?? 0);
    const { countUp, update } = useCountUp({ start: 0, end: 0 });

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

    const onClickBet = () => {
        const quickBetStorage = getSessionStorageItem<QuickBetStorage>(quickBetStorageKey);
        const quickBetSetting = quickBetStorage[id];
        const betValue = quickBetSetting?.betStake ?? 1;
        const enabledQuickBet = quickBetSetting?.enabledQuickBet;

        enabledQuickBet ? placeBet(choice, betValue) : openPlaceBetModal(choice);
    };

    const renderUserBetChips = () => {
        return chips.map((value, index) => <DisplayChip key={index} chipValue={value} chipKey={index} />);
    };

    return (
        <div className={Styles.container}>
            <div
                className={`${Styles["bet-option"]} ${isHighlight && Styles[HighlightClassNameMapper[highlightType]]} ${
                    isHighlight && isShowWinningEffect && Styles["winning-effect"]
                }`}
                onClick={onClickBet}
            >
                {isDisplayOdd && <div className={Styles.odd}>{odd ? `1:${odd}` : ""}</div>}

                <div className={Styles["total-bet"]}>
                    {gameState === GameState.BalancingBet ? convertStakeToString(+countUp) : convertStakeToString(totalBet)}
                </div>
                {children}
                <div className={getUserBetChipClass(gameName, choice)}>{renderUserBetChips()}</div>
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
