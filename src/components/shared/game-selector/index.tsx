import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import appSettings from "../../../common/app-settings";
import { GameResourceKeys } from "../../../common/resources";
import Styles from "./game-selector.module.scss";

export const GameSelector: React.FC<{ onChangeGame: Function; selectedGame: number }> = ({ onChangeGame, selectedGame }) => {
    const { t } = useTranslation();
    const [isShowOptions, setIsShowOptions] = useState(false);

    return (
        <div className={Styles["selector-container"]}>
            <div className={"selected-item"} onClick={() => setIsShowOptions(true)}>
                {t(`${appSettings.gameSettings[selectedGame].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
            </div>
            {isShowOptions && (
                <div className={Styles["items"]}>
                    {appSettings.offeredGames.map((id) => (
                        <span key={id} onClick={() => onChangeGame(id)}>
                            {t(`${appSettings.gameSettings[id].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
