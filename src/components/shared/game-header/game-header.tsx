import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useFavoriteGameContext } from "../../../contexts/favorite-games/favorite-games-context";
import { useGameActionContext } from "../../../contexts/game-actions-context";
import { useGameContext } from "../../../contexts/game-context/game-context";
import CountdownTimer from "../countdown-timer/countdown-timer";
import { GameState, PopupType, RebetStorageModel } from "../game-base/type";
import Styles from "./game-header.module.scss";

export default function GameHeader() {
    const favoriteContext = useFavoriteGameContext();
    const gameActions = useGameActionContext();
    const { roundId, gameState, gameSetting } = useGameContext();
    const { id: gameId, gameName } = gameSetting;

    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[gameId];

    const [isFavorite, updateFavorite] = useState<boolean>(favoriteContext.isFavorite(gameId));
    const [disabledRebet, updateRebetStatus] = useState<boolean>(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { t } = useTranslation(gameName.toLowerCase());

    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const favoriteClickHandle = () => {
        favoriteContext.setFavorite(gameId, !isFavorite);
        updateFavorite(!isFavorite);
    };

    useEffect(() => {
        gameState != GameState.InRound && updateRebetStatus(true);
    }, [gameState]);

    useEffect(() => {
        updateRebetStatus(rebetInfo?.betInfo == undefined);
    }, [roundId]);

    const isShowTimer = () => gameState === GameState.InRound || gameState === GameState.LockingBet || gameState === GameState.Waiting;

    return (
        <div className={Styles.header}>
            <div className={Styles["header-left"]}>
                <div className={Styles["favorite-btn"]} onClick={() => favoriteClickHandle()}>
                    <span className={isFavorite ? "icon-favorite" : "icon-favorite-normal"}></span>
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

            <div className={Styles["header-right"]}>
                <button className={Styles.rebet} disabled={disabledRebet} onClick={() => gameActions.openPopup(PopupType.Rebet)}>
                    Rebet
                </button>

                <Dropdown isOpen={dropdownOpen} toggle={toggle} className={Styles["dropdown"]}>
                    <DropdownToggle className={Styles["dropdown-toggle"]}>
                        <div className={Styles["hamburger-dot"]}></div>
                        <div className={Styles["hamburger-dot"]}></div>
                        <div className={Styles["hamburger-dot"]}></div>
                    </DropdownToggle>
                    <DropdownMenu right className={Styles["dropdown-menu"]}>
                        <DropdownItem className={Styles["dropdown-item"]} onClick={() => gameActions.openPopup(PopupType.BetHistory)}>
                            Ticket history
                        </DropdownItem>
                        <DropdownItem className={Styles["dropdown-item"]}>Result</DropdownItem>
                        <DropdownItem className={Styles["dropdown-item"]} onClick={() => gameActions.openPopup(PopupType.Guide)}>
                            Game guide
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}
