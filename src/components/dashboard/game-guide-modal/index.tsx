import React, { useState } from "react";
import appSettings from "../../../common/app-settings";
import { GameResourceKeys } from "../../../common/resources";
import BaseDialog from "../../shared/base-dialog";
import Styles from "./game-guide-modal.module.scss";
import GameGuides from "./game-guide";
import { useTranslation } from "next-i18next";

export const GameGuideModal: React.FC<{ onCloseModal: Function; userStakeLevel }> = ({ onCloseModal, userStakeLevel }) => {
    const [selectedGameId, setSelectedGameId] = useState<number>(-1);
    const { t } = useTranslation();
    const handleChangeGame = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGameId(+e.target.value);
    };

    const closeModal = () => {
        onCloseModal();
    };

    return (
        <BaseDialog onCloseModal={closeModal}>
            <div className={Styles["popup-container"]}>
                <div className={Styles["title"]}>{t("popupTitleGuide")}</div>
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
                <div className={Styles["guide-content"]}>
                    {selectedGameId !== -1 && <GameGuides gameId={selectedGameId} userStakeLevel={userStakeLevel} />}
                </div>
            </div>
        </BaseDialog>
    );
};
