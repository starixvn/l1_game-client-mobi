import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../../common/local-storage";
import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import CountdownTimer from "../countdown-timer/countdown-timer";
import { GameState, PopupType, RebetStorageModel, ViewMode } from "../game-base/type";
import Styles from "./game-header.module.scss";

const displayModeHintStorageKey = localStorageKeys.displayModeHint;
export const getViewModeWhenClick = (viewMode: ViewMode) => {
    let mode = ViewMode.full;
    switch (viewMode) {
        case ViewMode.full:
            mode = ViewMode.simple;
            break;
        case ViewMode.simple:
            mode = ViewMode.collapse;
            break;
        default:
            break;
    }

    return mode;
};

export default function GameHeader() {
    const systemContext = useSystemContext();
    const { roundId, gameSetting, viewMode, gameState } = useGameContext();
    const { updateViewMode, renderResultCollapse } = useGameActionContext();
    const { id: gameId, gameName } = gameSetting;
    const [isFavorite, updateFavorite] = useState<boolean>(systemContext.checkFavorite(gameId));
    const gameIdModeViewOnStorage = getLocalStorageItem<object[]>(localStorageKeys.modeViewIds);
    const [gameIdModeView, updateGameIdModeView] = useState<object[]>(gameIdModeViewOnStorage ?? []);
    const { t } = useTranslation([gameName.toLowerCase()]);

    const favoriteClickHandle = (e: React.MouseEvent) => {
        e.stopPropagation();
        systemContext.setFavorite(gameId, !isFavorite);
        updateFavorite(!isFavorite);
    };

    const handleStorageViewModeIds = (mode: ViewMode) => {
        const gameIdModeViewOnStorage = getLocalStorageItem<object[]>(localStorageKeys.modeViewIds) ?? [];
        const newGameIdCompactMode = [...gameIdModeViewOnStorage];

        if (newGameIdCompactMode.some((modeData) => +Object.keys(modeData)[0] === gameId) && newGameIdCompactMode.length > 0) {
            newGameIdCompactMode.forEach((modeData) => {
                if (modeData.hasOwnProperty(gameId)) {
                    modeData[gameId] = mode;
                }
            });
        } else {
            newGameIdCompactMode.push({ [gameId]: mode });
        }

        updateGameIdModeView(newGameIdCompactMode);
        storeLocalStorageItem(localStorageKeys.modeViewIds, newGameIdCompactMode);
    };

    const onHeaderClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMobileOnly) {
            const mode = getViewModeWhenClick(viewMode);
            updateViewMode(mode);
            handleStorageViewModeIds(mode);
            storeLocalStorageItem(displayModeHintStorageKey, true);
        }
    };

    useEffect(() => {
        if (isMobileOnly) {
            gameIdModeView.forEach((modeData, index) => {
                if (modeData.hasOwnProperty(gameId)) {
                    updateViewMode(modeData[gameId]);
                }
            });
        }
    }, []);

    const showCollapseResult = () => {
        return (
            viewMode == ViewMode.collapse &&
            (gameState === GameState.DisplayResult || gameState === GameState.Waiting || gameState == GameState.BeforeStartRound)
        );
    };

    return (
        <div className={`${Styles.header} ${viewMode === ViewMode.collapse ? Styles["border-radius-bottom"] : ""}`} onClick={onHeaderClick}>
            <div className={Styles["header-left"]}>
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

            <HeaderRight handleStorageViewModeIds={handleStorageViewModeIds} displayMenu={!showCollapseResult()} />
            {showCollapseResult() && <div className={Styles["header-result"]}>{renderResultCollapse()}</div>}
        </div>
    );
}

enum ClassType {
    hamburgerDot,
    dropdownItem,
}

const HeaderRight = ({ handleStorageViewModeIds, displayMenu }) => {
    const gameActions = useGameActionContext();
    const { roundId, gameState, gameSetting, ownBets, viewMode } = useGameContext();
    const { updateViewMode } = useGameActionContext();
    const { t } = useTranslation([ResourceTypes.COMMON]);
    const { id: gameId } = gameSetting;
    const [disabledRebet, updateRebetStatus] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDropdownOpen((prevState) => !prevState);
    };
    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[gameId];
    const classList = ["hamburger-dot", "dropdown-item"];
    const rebetClickHandle = (e: React.MouseEvent) => {
        e.stopPropagation();
        gameActions.openPopup(PopupType.Rebet);
    };

    const onDropDownItemClick = (mode: ViewMode) => {
        if (viewMode !== mode) {
            updateViewMode(mode);
            handleStorageViewModeIds(mode);
        }

        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        gameState !== GameState.InRound && updateRebetStatus(true);
    }, [gameState]);

    useEffect(() => {
        updateRebetStatus(rebetInfo?.betInfo === undefined);
    }, [roundId]);

    return (
        <div className={Styles["header-right"]}>
            {viewMode !== ViewMode.collapse ? (
                <button className={Styles.rebet} disabled={disabledRebet || Object.keys(ownBets).length !== 0} onClick={rebetClickHandle}>
                    {t(CommonResourceKeys.REBET)}
                </button>
            ) : (
                ""
            )}
            {displayMenu && (
                <Dropdown isOpen={dropdownOpen} toggle={toggle} className={Styles["dropdown"]}>
                    <DropdownToggle className={Styles["dropdown-toggle"]}>
                        <div className={Styles[classList[ClassType.hamburgerDot]]}></div>
                        <div className={Styles[classList[ClassType.hamburgerDot]]}></div>
                        <div className={Styles[classList[ClassType.hamburgerDot]]}></div>
                    </DropdownToggle>
                    <DropdownMenu right className={Styles["dropdown-menu"]}>
                        <DropdownItem
                            className={Styles[classList[ClassType.dropdownItem]]}
                            onClick={() => gameActions.openPopup(PopupType.BetHistory)}
                        >
                            {t(CommonResourceKeys.HISTORY_POPUP_TITLE)}
                        </DropdownItem>
                        {isMobileOnly && (
                            <div onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown-item-none-event">{t(CommonResourceKeys.DISPLAY_MODE)}</div>
                                <div
                                    className={`dropdown-item ${classList[ClassType.dropdownItem]} ${Styles["display-mode"]}`}
                                    onClick={() => onDropDownItemClick(ViewMode.full)}
                                >
                                    {t(CommonResourceKeys.DISPLAY_MODE_FULL)}
                                    {viewMode === ViewMode.full && <span className={`icon-success ${Styles["icon"]}`}></span>}
                                </div>
                                <div
                                    className={`dropdown-item ${classList[ClassType.dropdownItem]} ${Styles["display-mode"]}`}
                                    onClick={() => onDropDownItemClick(ViewMode.simple)}
                                >
                                    {t(CommonResourceKeys.DISPLAY_MODE_SIMPLE)}
                                    {viewMode === ViewMode.simple && <span className={`icon-success ${Styles["icon"]}`}></span>}
                                </div>
                                <div
                                    className={`dropdown-item ${classList[ClassType.dropdownItem]} ${Styles["display-mode"]}`}
                                    onClick={() => onDropDownItemClick(ViewMode.collapse)}
                                >
                                    {t(CommonResourceKeys.DISPLAY_MODE_COLLAPSE)}
                                    {viewMode === ViewMode.collapse && <span className={`icon-success ${Styles["icon"]}`}></span>}
                                </div>
                            </div>
                        )}

                        <DropdownItem
                            className={Styles[classList[ClassType.dropdownItem]]}
                            onClick={() => gameActions.openPopup(PopupType.Guide)}
                        >
                            {t(CommonResourceKeys.GUIDE_POPUP_TITLE)}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    );
};
