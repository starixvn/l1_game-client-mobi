import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useDeviceContext } from "../../../contexts/device";
import { useFavoriteGameContext } from "../../../contexts/favorite-games/favorite-games-context";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRoundResultContext } from "../../../contexts/round-result";
import CountdownTimer from "../countdown-timer/countdown-timer";
import { GameState, PopupType, RebetStorageModel } from "../game-base/type";
import Styles from "./game-header.module.scss";

export default function GameHeader() {
    const favoriteContext = useFavoriteGameContext();
    const { roundId, gameState, gameSetting } = useGameContext();
    const { updateCompactMode } = useGameActionContext();
    const { isMobile } = useDeviceContext();

    const { id: gameId, gameName } = gameSetting;
    const [isFavorite, updateFavorite] = useState<boolean>(favoriteContext.isFavorite(gameId));
    const { t } = useTranslation([gameName.toLowerCase()]);

    const favoriteClickHandle = () => {
        favoriteContext.setFavorite(gameId, !isFavorite);
        updateFavorite(!isFavorite);
    };

    const isShowTimer = () => gameState === GameState.InRound || gameState === GameState.LockingBet;

    const onHeaderClick = () => {
        if (isMobile) {
            updateCompactMode();
        }
    };

    return (
        <div className={Styles.header} onClick={() => onHeaderClick()}>
            <div className={Styles["header-left"]}>
                <div className={Styles["favorite-btn"]} onClick={() => favoriteClickHandle()}>
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
                    <div className={Styles.round}>#{roundId}</div>
                </div>
            </div>
            {isShowTimer() && (
                <div className={Styles["count-down"]}>
                    <CountdownTimer key={gameState} />
                </div>
            )}

            <HeaderRight />
        </div>
    );
}

const HeaderRight = () => {
    const gameActions = useGameActionContext();
    const { roundId, gameState, gameSetting } = useGameContext();
    const { t } = useTranslation([ResourceTypes.COMMON]);
    const { id: gameId } = gameSetting;
    const [disabledRebet, updateRebetStatus] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[gameId];
    const { getRoundResultUrl } = useRoundResultContext();

    useEffect(() => {
        gameState != GameState.InRound && updateRebetStatus(true);
    }, [gameState]);

    useEffect(() => {
        updateRebetStatus(rebetInfo?.betInfo == undefined);
    }, [roundId]);
    return (
        <div className={Styles["header-right"]}>
            <button className={Styles.rebet} disabled={disabledRebet} onClick={() => gameActions.openPopup(PopupType.Rebet)}>
                {t(CommonResourceKeys.REBET)}
            </button>
            <Dropdown isOpen={dropdownOpen} toggle={toggle} className={Styles["dropdown"]}>
                <DropdownToggle className={Styles["dropdown-toggle"]}>
                    <div className={Styles["hamburger-dot"]}></div>
                    <div className={Styles["hamburger-dot"]}></div>
                    <div className={Styles["hamburger-dot"]}></div>
                </DropdownToggle>
                <DropdownMenu right className={Styles["dropdown-menu"]}>
                    <DropdownItem className={Styles["dropdown-item"]} onClick={() => gameActions.openPopup(PopupType.BetHistory)}>
                        {t(CommonResourceKeys.HISTORY_POPUP_TITLE)}
                    </DropdownItem>
                    <DropdownItem className={Styles["dropdown-item"]} onClick={() => getRoundResultUrl(gameId)}>
                        {t(CommonResourceKeys.RESULT)}
                    </DropdownItem>
                    <DropdownItem className={Styles["dropdown-item"]} onClick={() => gameActions.openPopup(PopupType.Guide)}>
                        {t(CommonResourceKeys.GUIDE_POPUP_TITLE)}
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};
