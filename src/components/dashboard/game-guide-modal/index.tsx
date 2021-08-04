import React, { useState } from "react";
import appSettings from "../../../common/app-settings";
import BaseDialog from "../../shared/base-dialog";
import Styles from "./game-guide-modal.module.scss";
import GameGuides from "./game-guide";
import { useTranslation } from "next-i18next";
import { GameSelector } from "../../shared/game-selector";

export const GameGuideModal: React.FC<{ onCloseModal: Function; userStakeLevel }> = ({ onCloseModal, userStakeLevel }) => {
    const [selectedGameId, setSelectedGameId] = useState<number>(appSettings.offeredGames[0]);
    const { t } = useTranslation();

    const closeModal = () => {
        onCloseModal();
    };

    return (
        <BaseDialog onCloseModal={closeModal} enableBackdrop={true}>
            <div className={Styles["popup-container"]}>
                <div className={Styles["title"]}>{t("popupTitleGuide")}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal}></span>
                <div className={Styles["form"]}>
                    <span className={Styles["form-label"]}>Game</span>
                    <GameSelector onChangeGame={setSelectedGameId} selectedGame={selectedGameId} />
                </div>
                <div className={Styles["guide-content"]}>
                    {selectedGameId !== -1 && <GameGuides gameId={selectedGameId} userStakeLevel={userStakeLevel} />}
                </div>
            </div>
        </BaseDialog>
    );
};
