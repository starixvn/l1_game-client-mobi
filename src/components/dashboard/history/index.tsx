import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import appSettings from "../../../common/app-settings";
import BaccaratBetHistory from "../../games/baccarat/bet-history";
import BigSmallBetHistory from "../../games/big-small/bet-history";
import DragonTigerBetHistory from "../../games/dragon-tiger/bet-history";
import FishPrawnCrabBetHistory from "../../games/fish-prawn-crab/bet-history";
import KenoProMaxBetHistory from "../../games/keno-pro-max/bet-history";
import SeDieBetHistory from "../../games/se-die/bet-history";
import SeDieSpecialBetHistory from "../../games/special-sedie/bet-history";
import ThreeCardsBetHistory from "../../games/three-cards/bet-history";
import KenoMatchBetHistory from "../../games/keno-match/bet-history";
import BaseDialog from "../../shared/base-dialog";
import { GameSelector } from "../../shared/game-selector";
import Styles from "./history.module.scss";

export const HistoryModal: React.FC<{ onCloseModal: Function; offerGames: number[] }> = ({ onCloseModal, offerGames }) => {
    const { t } = useTranslation();
    const [selectedGameId, setSelectedGameId] = useState<number>(appSettings.offeredGames[0]);

    const closeModal = () => {
        onCloseModal();
    };

    const renderHistory = () => {
        switch (selectedGameId) {
            case 1:
            case 4:
                return <BigSmallBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 2:
            case 9:
            case 22:
                return <SeDieBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 3:
                return <FishPrawnCrabBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 7:
                return <DragonTigerBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 8:
                return <KenoProMaxBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 10:
            case 27:
                return <BaccaratBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 24:
                return <SeDieSpecialBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 35:
                return <ThreeCardsBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 36:
                return <KenoMatchBetHistory key={selectedGameId} gameId={selectedGameId} closeModal={closeModal} />;
            default:
                return null;
        }
    };

    return (
        <BaseDialog onCloseModal={closeModal} enableBackdrop={true}>
            <div className={`w-100 ${Styles["popup-container"]}`}>
                <div className={Styles["title"]}>{t("popupTitleHistory")}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal}></span>
                <div className={Styles["form"]}>
                    <span className={Styles["form-label"]}>Game</span>
                    <GameSelector onChangeGame={setSelectedGameId} selectedGame={selectedGameId} offerGames={offerGames} />
                </div>
                <div className={`w-100 ${Styles["history-content"]}`}>{renderHistory()}</div>
            </div>
        </BaseDialog>
    );
};
