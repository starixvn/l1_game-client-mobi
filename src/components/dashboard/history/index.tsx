import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import appSettings from "../../../common/app-settings";
import BaccaratBetHistory from "../../games/baccarat/bet-history";
import BigSmallBetHistory from "../../games/big-small/bet-history";
import DragonTigerBetHistory from "../../games/dragon-tiger/bet-history";
import FishPrawnCrabBetHistory from "../../games/fish-prawn-crab/bet-history";
import KenoBetHistory from "../../keno/bet-history";
import KenoProMaxBetHistory from "../../games/keno-pro-max/bet-history";
import SeDieBetHistory from "../../games/se-die/bet-history";
import SeDieSpecialBetHistory from "../../games/special-sedie/bet-history";
import ThreeCardsBetHistory from "../../games/three-cards/bet-history";
import BaseDialog from "../../shared/base-dialog";
import GameSelector from "../../shared/game-selector";
import Styles from "./history.module.scss";

export const HistoryModal: React.FC<{ onCloseModal: Function; offerGames: number[]; fractionalOddsFormat: boolean | undefined }> = ({
    onCloseModal,
    offerGames,
    fractionalOddsFormat,
}) => {
    const { t } = useTranslation();
    const [selectedGameId, setSelectedGameId] = useState<number>(appSettings.offeredGames.filter((game) => offerGames.includes(game))[0]);
    const closeModal = () => {
        onCloseModal();
    };

    const renderHistory = () => {
        switch (selectedGameId) {
            case 1:
            case 4:
                return <BigSmallBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
            case 2:
            case 9:
            case 22:
                return <SeDieBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
            case 3:
                return <FishPrawnCrabBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
            case 7:
                return <DragonTigerBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
            case 8:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 52:
            case 53:
                return <KenoProMaxBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
            case 10:
            case 27:
                return <BaccaratBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
            case 24:
                return <SeDieSpecialBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
            case 36:
            case 37:
            case 40:
            case 41:
                return (
                    <KenoBetHistory
                        key={selectedGameId}
                        gameId={selectedGameId}
                        fractionalOddsFormat={fractionalOddsFormat}
                        closeModal={closeModal}
                    />
                );
            default:
                return <ThreeCardsBetHistory key={selectedGameId} gameId={selectedGameId} fractionalOddsFormat={fractionalOddsFormat} />;
        }
    };

    return (
        <BaseDialog onCloseModal={closeModal} enableBackdrop={true}>
            <div className={`w-100 ${Styles["popup-container"]}`}>
                <div className={Styles["title"]}>{t("popupTitleHistory")}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal} data-testid="icon-close"></span>
                <div className={Styles["form"]}>
                    <span className={Styles["form-label"]}>Game</span>
                    <GameSelector onChangeGame={setSelectedGameId} selectedGame={selectedGameId} offerGames={offerGames} />
                </div>
                <div className={`w-100 ${Styles["history-content"]}`}>{renderHistory()}</div>
            </div>
        </BaseDialog>
    );
};
