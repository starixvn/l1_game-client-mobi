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
import { GameState, PopupType, RebetStorageModel, ModeView } from "../game-base/type";
import Styles from "./game-header.module.scss";

const displayModeHintStorageKey = localStorageKeys.displayModeHint;
export const getModeViewWhenClick = (modeView: ModeView) => {
    let mode = ModeView.full;
    switch (modeView) {
        case ModeView.full:
            mode = ModeView.compact;
            break;
        case ModeView.compact:
            mode = ModeView.collapse;
            break;
        default:
            break;
    }

    return mode;
};

export default function GameHeader() {
    const systemContext = useSystemContext();
    const { roundId, gameSetting, modeView, remainingTime, gameState } = useGameContext();
    const { updateModeView, renderResultCollapse } = useGameActionContext();
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

    const handleStorageModeViewIds = (mode: ModeView) => {
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
            const mode = getModeViewWhenClick(modeView);
            updateModeView(mode);
            handleStorageModeViewIds(mode);
            storeLocalStorageItem(displayModeHintStorageKey, true);
        }
    };

    useEffect(() => {
        if (isMobileOnly) {
            gameIdModeView.forEach((modeData) => {
                if (modeData.hasOwnProperty(gameId)) {
                    updateModeView(modeData[gameId]);
                }
            });
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
                <HeaderRight handleStorageModeViewIds={handleStorageModeViewIds} />
            </div>
            <CountdownTimer key={gameState} />

            <HeaderRight handleStorageModeViewIds={handleStorageModeViewIds} />
            {gameState === GameState.DisplayResult && modeView === ModeView.collapse && (
                <div className={Styles["header-result"]}>{renderResultCollapse()}</div>}

        </Fragment>
    );
}

enum ClassType {
    hamburgerDot,
    dropdownItem,
}

const HeaderRight = ({ handleStorageModeViewIds }) => {
    const gameActions = useGameActionContext();
    const { roundId, gameState, gameSetting, ownBets, modeView } = useGameContext();
    const { updateModeView } = useGameActionContext();
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

    const onDropDownItemClick = (mode: ModeView) => {
        if (modeView !== mode) {
            updateModeView(mode);
            handleStorageModeViewIds(mode);
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
            {modeView !== ModeView.collapse ? (
                <button className={Styles.rebet} disabled={disabledRebet || Object.keys(ownBets).length !== 0} onClick={rebetClickHandle}>
                    {t(CommonResourceKeys.REBET)}
                </button>
            ) : (
                ""
            )}

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
                                onClick={() => onDropDownItemClick(ModeView.full)}
                            >
                                {t(CommonResourceKeys.DISPLAY_MODE_FULL)}
                                {modeView === ModeView.full && <span className={`icon-success ${Styles["icon"]}`}></span>}
                            </div>
                            <div
                                className={`dropdown-item ${classList[ClassType.dropdownItem]} ${Styles["display-mode"]}`}
                                onClick={() => onDropDownItemClick(ModeView.compact)}
                            >
                                {t(CommonResourceKeys.DISPLAY_MODE_COMPACT)}
                                {modeView === ModeView.compact && <span className={`icon-success ${Styles["icon"]}`}></span>}
                            </div>
                            <div
                                className={`dropdown-item ${classList[ClassType.dropdownItem]} ${Styles["display-mode"]}`}
                                onClick={() => onDropDownItemClick(ModeView.collapse)}
                            >
                                {t(CommonResourceKeys.DISPLAY_MODE_ULTRA_COMPACT)}
                                {modeView === ModeView.collapse && <span className={`icon-success ${Styles["icon"]}`}></span>}
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
        </div>
    );
};
