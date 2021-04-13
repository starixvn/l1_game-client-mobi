import React from "react";
import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";

import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { BetSettingStorageType } from "../../bet-settings/type";
import { GameState } from "../game-base/type";
import Styles from "./bet-option.module.scss";

type Props = {
    choice: string;
    odd: number;
    children: React.ReactNode;
    isHighlight: boolean;
    isDisplayOdd?: boolean;
    gameState: GameState;
};

const getAnimationByGameState = (gameState: GameState) => {
    switch (gameState) {
        case GameState.Waiting:
            return "winning-effect";
        case GameState.BeforeStartRound:
        case GameState.InRound:
            return "hightlight-winning";
        default:
            return "";
    }
};

const BetOption: React.FunctionComponent<Props> = ({ gameState, choice, odd, children, isHighlight = false, isDisplayOdd = true }) => {
    const { totalBets, ownBets } = useGameContext();
    const { openPlaceBetModal } = useGameActionContext();
    const betSettingKey = localStorageKeys.betSetting;
    const gameActionContext = useGameActionContext();

    function onClickBet() {
        const betSettings = getLocalStorageItem<BetSettingStorageType>(betSettingKey);

        betSettings?.enabledQuickBet ? gameActionContext.placeBet(choice, betSettings.betValue) : openPlaceBetModal(choice);
    }

    return (
        <div className={Styles.container}>
            <div
                className={`${Styles["bet-option"]} ${isHighlight ? Styles[getAnimationByGameState(gameState)] : ""}`}
                onClick={onClickBet}
            >
                {isDisplayOdd && <div className={Styles.odd}>{`1:${odd}`}</div>}
                <div className={Styles["total-bet"]}>{totalBets?.[choice]}</div>
                {children}
                <div className={Styles["own-bet"]}>{ownBets?.[choice]}</div>
            </div>
        </div>
    );
};

export default BetOption;
