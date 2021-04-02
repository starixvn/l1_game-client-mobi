import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

import { GameResourceKeys } from "../../../common/resources/game-resource-keys";
import { useFavoriteGameContext } from "../../../contexts/favorite-games/favorite-games-context";
import CountdownTimer from "../countdown-timer/countdown-timer";
import Styles from "./game-header.module.scss";
import { getLocalStorageItem, localStorageKeys } from "../../../common/local-storage";
import { GameState, RebetStorageModel } from "../game-base/type";
import { GameContext, useGameContext } from "../../../contexts/game-context/game-context";
import BaseModal from "../base-modal";
import SeDieGuide from "../../games/se-die/game-guide";
import BauCuaGuide from "../../games/fish-prawn-crab/game-guide";
import SeDieTicketHistory from "../../games/se-die/ticket-history";

type Props = {
    gameId: number;
    gameName: string;
    roundId: number;
    gameState: number;
    remainingTime: number;
    apiUrl: string;
};

export default function GameHeader(props: Props) {
    const favoriteContext = useFavoriteGameContext();
    const gameContext = useGameContext();
    const { gameName, roundId, gameState, remainingTime, gameId, apiUrl, history } = props;
    const rebetStorageKey = localStorageKeys.rebet;
    const rebetStorage = getLocalStorageItem<RebetStorageModel>(rebetStorageKey) || {};
    const rebetInfo = rebetStorage[props.gameId];

    const [isFavorite, updateFavorite] = useState<boolean>(favoriteContext.isFavorite(gameId));
    const [disabledRebet, updateRebetStatus] = useState<boolean>(false);

    const { t } = useTranslation(gameName.toLowerCase());

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const onClickRebet = () => {
        const betChoices = rebetInfo.betInfo;
        Object.keys(betChoices).forEach((key) => {
            gameContext.placeBet(key, betChoices[key]);
        });

        updateRebetStatus(true);
    };

    const favoriteClickHandle = () => {
        favoriteContext.setFavorite(gameId, !isFavorite);
        updateFavorite(!isFavorite);
    };
    const [isOpenGameGuide, updateGameGuideState] = useState<boolean>(false);
    const openGameGuide = () => {
        updateGameGuideState(!isOpenGameGuide);
    };
    const renderGameGuide = () => {
        switch (gameId) {
            case 2:
                return <SeDieGuide />;
            case 3:
                return <BauCuaGuide />;
            default:
                return null;
        }
    };

    const [isOpenTicketHistory, updateTicketHistoryState] = useState<boolean>(false);
    const openTicketHistory = () => {
        updateTicketHistoryState(!isOpenTicketHistory);
        gameContext.getHistory(1);
    };

    const renderGameHistory = () => {
        switch (gameId) {
            case 2:
                return <SeDieTicketHistory/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        props.gameState != GameState.InRound && updateRebetStatus(true);
    }, [props.gameState]);

    useEffect(() => {
        updateRebetStatus(rebetInfo?.betInfo == undefined);
    }, [props.roundId]);

    return (
        <div className={Styles.header}>
            <div className={Styles["header-left"]}>
                <div className={`${Styles["favorite-btn"]} ${isFavorite ? Styles.isFavorite : ""}`} onClick={() => favoriteClickHandle()}>
                    <span className="icon-favorite"></span>
                </div>
                <div className={Styles["title-roundID"]}>
                    <div className={Styles.title}>{t(GameResourceKeys.GAME_NAME)}</div>
                    <div className={Styles.round}>#{roundId}</div>
                </div>
            </div>
            <div className={Styles["count-down"]}>
                <CountdownTimer remainingTime={remainingTime} key={gameState}></CountdownTimer>
            </div>
            <div className={Styles["header-right"]}>
                <button className={Styles.rebet} disabled={disabledRebet} onClick={() => onClickRebet()}>
                    <label>Rebet</label>
                </button>

                <Dropdown isOpen={dropdownOpen} toggle={toggle} className={Styles["dropdown"]}>
                    <DropdownToggle className={Styles["dropdown-toggle"]}>
                        <div className={Styles["hamburger-dot"]}></div>
                        <div className={Styles["hamburger-dot"]}></div>
                        <div className={Styles["hamburger-dot"]}></div>
                    </DropdownToggle>
                    <DropdownMenu right className={Styles["dropdown-menu"]}>
                        <DropdownItem className={Styles["dropdown-item"]} onClick={() => openTicketHistory()}>
                            Ticket history
                        </DropdownItem>
                        <DropdownItem className={Styles["dropdown-item"]}>Result</DropdownItem>
                        <DropdownItem className={Styles["dropdown-item"]} onClick={() => openGameGuide()}>
                            Game guide
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            {isOpenGameGuide && (
                <BaseModal isOpen={isOpenGameGuide} onCloseModal={() => updateGameGuideState(false)}>
                    {renderGameGuide()}
                </BaseModal>
            )}

            {isOpenTicketHistory && (
                <BaseModal isOpen={isOpenTicketHistory} onCloseModal={() => updateTicketHistoryState(false)}>
                    {renderGameHistory()}
                </BaseModal>
            )}
        </div>
    );
}
