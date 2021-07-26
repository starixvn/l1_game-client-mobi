import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import appSettings from "../../../common/app-settings";
import { GameResourceKeys } from "../../../common/resources";
import Styles from "./game-selector.module.scss";

export const GameSelector: React.FC<{ onChangeGame: Function; selectedGame: number }> = ({ onChangeGame, selectedGame }) => {
    const { t } = useTranslation();
    const [isShowOptions, setIsShowOptions] = useState(false);

    const onSelectOption = (gameId: number) => {
        setIsShowOptions(false);
        onChangeGame(gameId);
    };

    return (
        <div className={Styles["selector-container"]}>
            <div className={Styles["selected-item"]} onClick={() => setIsShowOptions(true)}>
                {t(`${appSettings.gameSettings[selectedGame].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
            </div>
            {isShowOptions && (
                <div className={Styles["dropdown-menu"]}>
                    {appSettings.offeredGames.map((id) => (
                        <span className={Styles["dropdown-item"]} key={id} onClick={() => onSelectOption(id)}>
                            {t(`${appSettings.gameSettings[id].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
