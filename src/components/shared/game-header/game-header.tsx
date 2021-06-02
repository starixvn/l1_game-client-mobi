import { useTranslation } from "next-i18next";
import React, { Fragment, useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../../common/local-storage";
import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import CountdownTimer from "../countdown-timer/countdown-timer";
import { GameState, PopupType, RebetStorageModel } from "../game-base/type";
import Styles from "./game-header.module.scss";

const displayModeHintStorageKey = localStorageKeys.displayModeHint;

export default function GameHeader() {
    const systemContext = useSystemContext();
    const { roundId, gameSetting, isCompactMode, remainingTime } = useGameContext();
    const { updateCompactMode } = useGameActionContext();
    const { id: gameId, gameName } = gameSetting;
    const [isFavorite, updateFavorite] = useState<boolean>(systemContext.checkFavorite(gameId));
    const gameIdCompactModeOnStorage = getLocalStorageItem<number[]>(localStorageKeys.compactModeIds) ?? [];
    const [gameIdCompactMode, updateGameIdCompactMode] = useState<number[]>(gameIdCompactModeOnStorage ?? []);
    const { t } = useTranslation([gameName.toLowerCase()]);

    const favoriteClickHandle = (e: React.MouseEvent) => {
        e.stopPropagation();
        systemContext.setFavorite(gameId, !isFavorite);
        updateFavorite(!isFavorite);
    };

    const handleStorageCompactModeIds = () => {
        const newGameIdCompactMode = [...gameIdCompactModeOnStorage];
        const gameIndex = newGameIdCompactMode.indexOf(gameId);
        gameIndex >= 0 && isCompactMode && newGameIdCompactMode.splice(gameIndex, 1);
        if (!isCompactMode && gameIndex < 0) {
            newGameIdCompactMode.push(gameId);
        }

        updateGameIdCompactMode(newGameIdCompactMode);
        storeLocalStorageItem(localStorageKeys.compactModeIds, newGameIdCompactMode);
    };

    const onHeaderClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMobileOnly) {
            updateCompactMode(true, false);
            handleStorageCompactModeIds();
            storeLocalStorageItem(displayModeHintStorageKey, true);
        }
    };

    useEffect(() => {
        if (isMobileOnly) {
            if (gameIdCompactMode.length > 0 && gameIdCompactMode.includes(gameId) && !isCompactMode) {
                updateCompactMode(true, false);
            }
        }
    }, []);

    return (
        <Fragment>
            <div className={Styles.header} onClick={onHeaderClick}>
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
                <CountdownTimer key={remainingTime} />
                <HeaderRight handleStorageCompactModeIds={handleStorageCompactModeIds} />
            </div>
        </Fragment>
    );
}

enum ClassType {
    hamburgerDot,
    dropdownItem,
}

const HeaderRight = ({ handleStorageCompactModeIds }) => {
    const gameActions = useGameActionContext();
    const { roundId, gameState, gameSetting, ownBets, isCompactMode } = useGameContext();
    const { updateCompactMode } = useGameActionContext();
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

    const onDropDownItemClick = (e, isDisplayFull: boolean) => {
        e.stopPropagation();
        if (isCompactMode !== isDisplayFull) {
            updateCompactMode(false, isDisplayFull);
            handleStorageCompactModeIds();
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
            <button className={Styles.rebet} disabled={disabledRebet || Object.keys(ownBets).length !== 0} onClick={rebetClickHandle}>
                {t(CommonResourceKeys.REBET)}
            </button>
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
                        <>
                            <div className="dropdown-item">{t(CommonResourceKeys.DISPLAY_MODE)}</div>
                            <div
                                className={`dropdown-item ${classList[ClassType.dropdownItem]} ${Styles["display-mode"]}`}
                                onClick={(e) => onDropDownItemClick(e, false)}
                            >
                                {t(CommonResourceKeys.DISPLAY_MODE_FULL)}
                                {!isCompactMode && <span className={`icon-success ${Styles["icon"]}`}></span>}
                            </div>
                            <div
                                className={`dropdown-item ${classList[ClassType.dropdownItem]} ${Styles["display-mode"]}`}
                                onClick={(e) => onDropDownItemClick(e, true)}
                            >
                                {t(CommonResourceKeys.DISPLAY_MODE_COMPACT)}
                                {isCompactMode && <span className={`icon-success ${Styles["icon"]}`}></span>}
                            </div>
                        </>
                    )}

                    <DropdownItem
                        className={Styles[classList[ClassType.dropdownItem]]}
                        onClick={() => gameActions.openPopup(PopupType.Guide)}
                    >
                        {t(CommonResourceKeys.GUIDE_POPUP_TITLE)}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};
