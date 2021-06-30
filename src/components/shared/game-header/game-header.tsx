import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useSystemContext } from "../../../contexts/system";
import CountdownTimer from "../countdown-timer/countdown-timer";
import { GameState, PopupType, RebetStorageModel, ViewMode } from "../game-base/type";
import Styles from "./game-header.module.scss";

export const getViewModeWhenClick = (viewMode: ViewMode) => {
    return viewMode === ViewMode.full ? ViewMode.collapse : ViewMode.full;
};

export default function GameHeader() {
    const systemContext = useSystemContext();
    const { roundId, gameSetting, viewMode, gameState } = useGameContext();
    const { updateViewMode, renderResultCollapse } = useGameActionContext();
    const { id: gameId, gameName } = gameSetting;
    const [isFavorite, updateFavorite] = useState<boolean>(systemContext.checkFavorite(gameId));
    const { t } = useTranslation([gameName.toLowerCase()]);

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
        <div className={`${Styles.header} ${viewMode === ViewMode.collapse ? Styles["border-radius-bottom"] : ""}`} onClick={onHeaderClick}>
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
}

enum ClassType {
    hamburgerDot,
    dropdownItem,
}

const HeaderRight = ({ displayMenu }) => {
    const gameActions = useGameActionContext();
    const { roundId, gameState, gameSetting, ownBets, viewMode } = useGameContext();
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
