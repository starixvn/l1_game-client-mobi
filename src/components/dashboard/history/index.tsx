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

    const closeModal = () => {
        onCloseModal();
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
        <BaseDialog onCloseModal={closeModal}>
            <div className={`w-100 ${Styles["history-container"]}`}>
                <div className={Styles["title"]}>{t("popupTitleHistory")}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal}></span>
                <div className={Styles["form"]}>
                    <span className={Styles["form-label"]}>Game</span>
                    <div className={Styles["select"]}>
                        <select className={Styles["form-control"]} value={selectedGameId} onChange={handleChangeGame}>
                            <option className={Styles["option-control"]} value={-1} disabled={true} style={{ display: "none" }}>
                                {t("gameSelectPlaceHolder")}
                            </option>
                            {appSettings.offeredGames.map((id) => (
                                <option value={id} key={id}>
                                    {t(`${appSettings.gameSettings[id].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={`w-100 ${Styles["history-content"]}`}>{renderHistory()}</div>
            </div>
        </BaseDialog>
    );
};
