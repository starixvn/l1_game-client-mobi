import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import appSettings from "../../../common/app-settings";
import { GameResourceKeys } from "../../../common/resources";
import BigSmallBetHistory from "../../games/big-small/bet-history";
import DragonTigerBetHistory from "../../games/dragon-tiger/bet-history";
import FishPrawnCrabBetHistory from "../../games/fish-prawn-crab/bet-history";
import SeDieBetHistory from "../../games/se-die/bet-history";
import BaseDialog from "../../shared/base-dialog";
import Styles from "./history.module.scss";

export const HistoryModal: React.FC<{ onCloseModal: Function }> = ({ onCloseModal }) => {
    const { t } = useTranslation();
    const [selectedGameId, setSelectedGameId] = useState<number>(-1);

    const handleChangeGame = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGameId(+e.target.value);
    };

    const renderHistory = () => {
        switch (selectedGameId) {
            case 1:
            case 4:
                return <BigSmallBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 2:
            case 22:
                return <SeDieBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 3:
                return <FishPrawnCrabBetHistory key={selectedGameId} gameId={selectedGameId} />;
            case 7:
                return <DragonTigerBetHistory key={selectedGameId} gameId={selectedGameId} />;
            default:
                return null;
        }
    };

    return (
        <BaseDialog onCloseModal={onCloseModal}>
            <div className={Styles["history-container"]}>
                <span className={Styles["title"]}>{t("popupTitleHistory")}</span>
                <div className={Styles["action"]}>
                    <span>Game</span>
                    <select value={selectedGameId} onChange={(e) => handleChangeGame(e)}>
                        <option value={-1} disabled={true} style={{ display: "none" }}>
                            {t("gameSelectPlaceHolder")}
                        </option>
                        {appSettings.offeredGames.map((id) => (
                            <option value={id} key={id}>
                                {t(`${appSettings.gameSettings[id].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={Styles["history-content"]}>{renderHistory()}</div>
            </div>
        </BaseDialog>
    );
};
