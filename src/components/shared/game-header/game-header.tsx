import { useTranslation } from "next-i18next";
import React, { useEffect, useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";

import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import CountdownTimer from "../countdown-timer/countdown-timer";
import { GameState, PopupType, RebetStorageModel, ViewMode } from "../game-base/type";
import BetSettings from "../bet-settings";
import Styles from "./game-header.module.scss";

export const getViewModeWhenClick = (viewMode: ViewMode) => {
    return viewMode === ViewMode.full ? ViewMode.collapse : ViewMode.full;
};

export default function GameHeader() {
    const { roundId, gameSetting, viewMode, gameState } = useGameContext();
    const systemContext = useSystemContext();
    const { updateViewMode, renderResultCollapse } = useGameActionContext();

    const { id: gameId, gameName } = gameSetting;
    const [isFavorite, updateFavorite] = useState<boolean>(systemContext.checkFavorite(gameId));
    const { t } = useTranslation([gameName.toLowerCase()]);

    return useMemo(() => {
        const favoriteClickHandle = (e: React.MouseEvent) => {
            e.stopPropagation();
            systemContext.setFavorite(gameId, !isFavorite);
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
            viewMode === ViewMode.collapse && (gameState === GameState.DisplayResult || gameState === GameState.BeforeStartRound);
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
                {!showCollapseResult() && <CountdownTimer key={gameState} />}
                <HeaderRight displayMenu={!showCollapseResult()} />
                {showCollapseResult() && <div className={Styles["header-result"]}>{renderResultCollapse()}</div>}
            </div>
        );
    }, [gameState, roundId, viewMode, isFavorite]);
}

const HeaderRight = ({ displayMenu }) => {
    const gameActions = useGameActionContext();
    const systemContext = useSystemContext();
    const { roundId, gameState, gameSetting, ownBets, viewMode, gameConfigs } = useGameContext();
    const { id: gameId } = gameSetting;
    const [disabledRebet, updateDisableRebet] = useState<boolean>(false);

    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[gameId];

    const rebetClickHandle = (e: React.MouseEvent) => {
        e.stopPropagation();
        gameActions.openPopup(PopupType.Rebet);
    };

    useEffect(() => {
        gameState !== GameState.InRound && updateDisableRebet(true);
    }, [gameState]);

    useEffect(() => {
        updateDisableRebet(rebetInfo?.betInfo === undefined || rebetInfo?.roundId + 1 !== roundId);
    }, [roundId]);

    return (
        <div className={Styles["header-right"]}>
            {viewMode !== ViewMode.collapse && (disabledRebet || Object.keys(ownBets).length !== 0) && (
                <button className={`game-header-button ${Styles.rebet}`} onClick={rebetClickHandle}>
                    <img src={"/static/images/game-header-rebet-icon.svg"} width={33} height={33} />
                </button>
            )}
            {displayMenu && (
                <BetSettings
                    gameId={gameId}
                    betSettings={systemContext.betSettings[gameId]}
                    updateBetSetting={systemContext.updateBetSetting}
                    gameConfigs={gameConfigs}
                />
            )}
        </div>
    );
};
