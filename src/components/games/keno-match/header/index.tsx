import { useTranslation } from "next-i18next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";

import { getLocalStorageItem, localStorageKeys } from "../../../../common/local-storage";
import { GameResourceKeys } from "../../../../common/resources/game-resource-keys";
import { useGameActionContext } from "../../../../contexts/game-actions-context";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../../contexts/system";
import BetSettings from "../../../shared/bet-settings";
import { PopupType, RebetStorageModel, ViewMode } from "../../../shared/game-base/type";
import Styles from "../../../shared/game-header/game-header.module.scss";
import { Tooltip } from "../../../shared/tooltip";
import CountdownTimer from "../countdown-timer/countdown-timer";
import {KenoMatchGameState} from "../type";
export const getViewModeWhenClick = (viewMode: ViewMode) => {
    return viewMode === ViewMode.full ? ViewMode.collapse : ViewMode.full;
};

export default function GameHeader() {
    const { roundId, gameSetting, viewMode, kenoMatchGameState } = useGameContext();
    const { updateViewMode, renderResultCollapse } = useGameActionContext();

    const { favoriteGames, setFavorite } = useSystemContext();

    const { id: gameId, gameName } = gameSetting;
    const [isFavorite, updateFavorite] = useState<boolean>(favoriteGames.includes(gameId));

    const { t } = useTranslation([gameName.toLowerCase()]);

    return useMemo(() => {
        const favoriteClickHandle = (e: React.MouseEvent) => {
            e.stopPropagation();
            setFavorite(gameId, !isFavorite);
            updateFavorite(!isFavorite);
        };

        const onHeaderClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isMobileOnly) {
                const mode = getViewModeWhenClick(viewMode);
                updateViewMode(mode);
            }
        };

        const showCollapseResult = () =>
            viewMode === ViewMode.collapse && (
                kenoMatchGameState === KenoMatchGameState.ShowFullTimeSettlementResult ||  
                kenoMatchGameState === KenoMatchGameState.ShowHalfTimeSettlementResult || 
                kenoMatchGameState === KenoMatchGameState.BeforeStartRound);
        return (
            <div
                className={`${Styles.header} ${viewMode === ViewMode.collapse ? Styles["border-radius-bottom"] : ""}`}
                onClick={onHeaderClick}
            >
                <div className={Styles["header-left"]}>
                    <div className={Styles["header-overlay"]}></div>
                    <div className={Styles["favorite-btn"]} onClick={favoriteClickHandle}>
                        <span
                            className={
                                isFavorite
                                    ? `icon-favorite ${Styles["icon-favorite"]}`
                                    : `icon-favorite-normal ${Styles["icon-favorite-normal"]}`
                            }
                        ></span>
                    </div>
                    <div className={Styles["title-roundID"]}>
                        <div className={Styles.title}>{t(GameResourceKeys.GAME_NAME)}</div>
                        <div key={roundId} className={Styles.round}>
                            #{roundId}
                        </div>
                    </div>
                </div>
                {!showCollapseResult() && <CountdownTimer key={kenoMatchGameState} />}
                <HeaderRight displayMenu={!showCollapseResult()} />
                {showCollapseResult() && <div className={Styles["header-result"]}>{renderResultCollapse()}</div>}
            </div>
        );
    }, [kenoMatchGameState, roundId, viewMode, isFavorite]);
}

const HeaderRight = ({ displayMenu }) => {
    const gameActions = useGameActionContext();
    const systemContext = useSystemContext();
    const { roundId, kenoMatchGameState, gameSetting, ownBets, viewMode, gameConfigs } = useGameContext();
    const { id: gameId } = gameSetting;
    const [disabledRebet, updateDisableRebet] = useState<boolean>(false);
    const { t } = useTranslation();
    const rebetBtnWrapper = useRef<HTMLDivElement>(null);

    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[gameId];

    const rebetClickHandle = (e: React.MouseEvent) => {
        e.stopPropagation();
        gameActions.openPopup(PopupType.Rebet);
    };

    useEffect(() => {
        (kenoMatchGameState !== KenoMatchGameState.FullTime ||  KenoMatchGameState.HalfTime) && updateDisableRebet(true);
    }, [kenoMatchGameState]);

    useEffect(() => {
        updateDisableRebet(rebetInfo?.betInfo === undefined || rebetInfo?.roundId + 1 !== roundId);
    }, [roundId]);

    return (
        <div className={Styles["header-right"]}>
            {viewMode !== ViewMode.collapse && !disabledRebet && Object.keys(ownBets).length === 0 && (
                <div ref={rebetBtnWrapper}>
                    <button className={`game-header-button ${Styles.rebet}`} onClick={rebetClickHandle}>
                        <img src={"/static/images/game-header-rebet-icon.svg"} width={33} height={33} alt="game-header-rebet-icon" />
                        <Tooltip message={t("rebet")} hoverWrapper={rebetBtnWrapper} />
                    </button>
                </div>
            )}
            {viewMode !== ViewMode.collapse && displayMenu && (
                <BetSettings
                    gameId={gameId}
                    betSettings={systemContext.betSettings[gameId]}
                    updateBetSetting={systemContext.updateBetSetting}
                    gameConfigs={gameConfigs}
                    isDisabled={kenoMatchGameState === KenoMatchGameState.Disabled}
                />
            )}
        </div>
    );
};

// import React, { useEffect, useState } from "react";

// import { KenoMatchGameDurations, KenoMatchGameState } from "../type";
// import Styles from "./header.module.scss";

// type Props = {
//     roundId: number;
//     remainingTime: number;
//     gameState: KenoMatchGameState;
//     gameDurations: KenoMatchGameDurations;
//     gameName: string
// };

// export default function KenoMatchGameHeader(props: Props) {
//     const [remainingTime, setRemainingTime] = useState<number>(0);

//     const { gameDurations, gameName } = props;

//     useEffect(() => {
//         console.log('header');
//         console.log(JSON.stringify(props, null, "\t"));
//         switch (props.gameState) {
//             case KenoMatchGameState.None:
//             case KenoMatchGameState.Disabled:
//             case KenoMatchGameState.ShowFullTimeResult:
//             case KenoMatchGameState.ShowFullTimeSettlementResult:
//             case KenoMatchGameState.ShowHalfTimeResult:
//             case KenoMatchGameState.ShowHalfTimeSettlementResult:
//                 setRemainingTime(0);
//                 break;
//             case KenoMatchGameState.HalfTime:
//             case KenoMatchGameState.HalfTimeLockingBet:
//                 setRemainingTime(props.remainingTime - gameDurations.finishHalfTime);
//                 break;
//             default:
//                 setRemainingTime(props.remainingTime);
//                 break;
//         }
//     }, [props.gameState]);

//     return (
//         <div className={Styles.header}>
//             <div className={Styles["header-content"]}>
//                 <HeaderCounter key={props.gameState} remainingTime={props.remainingTime} />
//                 <HeaderTitle roundId={props.roundId} gameName={gameName}/>
//             </div>
//             <RebetButton />
//         </div>
//     );
// }

// function HeaderTitle({ roundId, gameName }) {
//     return (
//         <div className={Styles["header-title-container"]}>
//             <h1 className={Styles["header-title"]}>{gameName}</h1>
//             <p className={Styles["draw-no"]}>
//                 Draw No.<span>{roundId}</span>
//             </p>
//         </div>
//     );
// }

// function HeaderCounter({ remainingTime }) {
//     const [counter, setCounter] = useState<number>(remainingTime);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             counter > 0 && setCounter(counter - 1);
//         }, 1000);

//         return () => clearInterval(interval);
//     });

//     return (
//         <div className={Styles["header-counter-container"]}>
//             <div className={Styles["header-counter"]}>
//                 <div className={Styles.timer}>00:{counter.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })}</div>
//             </div>
//         </div>
//     );
// }

// function RebetButton() {
//     return (
//         <div className={Styles["btnRebet"]}>
//             <div>
//                 <a>Rebet</a>
//             </div>
//         </div>
//     );
// }
