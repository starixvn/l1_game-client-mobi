import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { CommonResourceKeys, ResourceTypes } from "../../../common/resources";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import { useRoundResultContext } from "../../../contexts/round-result";
import { useSystemContext } from "../../../contexts/system";
import CountdownTimer from "../countdown-timer/countdown-timer";
import { GameState, PopupType, RebetStorageModel } from "../game-base/type";
import Styles from "./game-header.module.scss";

export default function GameHeader() {
    const systemContext = useSystemContext();
    const { roundId, gameState, gameSetting } = useGameContext();
    const { updateCompactMode } = useGameActionContext();

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
            updateCompactMode();
        }
    };

    return (
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
            <CountdownTimer key={gameState} />
            <HeaderRight />
        </div>
    );
}

enum ClassType {
    hamburgerDot,
    dropdownItem,
}

const HeaderRight = () => {
    const gameActions = useGameActionContext();
    const { roundId, gameState, gameSetting, ownBets } = useGameContext();
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
    const { getRoundResultUrl } = useRoundResultContext();
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
                    <DropdownItem className={Styles[classList[ClassType.dropdownItem]]} onClick={() => getRoundResultUrl(gameId)}>
                        {t(CommonResourceKeys.RESULT)}
                    </DropdownItem>
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
