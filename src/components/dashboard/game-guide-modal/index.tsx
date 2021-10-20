import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import BaseDialog from "../../shared/base-dialog";
import { GameSelector } from "../../shared/game-selector";
import GameGuides from "./game-guide";
import Styles from "./game-guide-modal.module.scss";

export const GameGuideModal: React.FC<{ onCloseModal: Function; userStakeLevel; offerGames: number[] }> = ({
    onCloseModal,
    userStakeLevel,
    offerGames,
}) => {
    const [selectedGameId, setSelectedGameId] = useState<number>(offerGames[0]);
    const { t } = useTranslation();

    const closeModal = () => {
        onCloseModal();
    };

    return (
        <BaseDialog onCloseModal={closeModal} enableBackdrop={true}>
            <div className={Styles["popup-container"]}>
                <div className={Styles["title"]}>{t("popupTitleGuide")}</div>
                <span className={`icon-close ${Styles["icon-close"]}`} onClick={closeModal} data-testid="icon-close"></span>
                <div className={Styles["form"]}>
                    <span className={Styles["form-label"]}>Game</span>
                    <GameSelector onChangeGame={setSelectedGameId} selectedGame={selectedGameId} offerGames={offerGames} />
                </div>
                <div className={Styles["guide-content"]}>
                    {selectedGameId !== -1 && <GameGuides gameId={selectedGameId} userStakeLevel={userStakeLevel} />}
                </div>
            </div>
        </BaseDialog>
    );
};
