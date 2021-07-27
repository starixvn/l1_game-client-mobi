import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import appSettings from "../../../common/app-settings";
import { GameResourceKeys } from "../../../common/resources";
import Styles from "./game-selector.module.scss";

export const GameSelector: React.FC<{ onChangeGame: Function; selectedGame: number }> = ({ onChangeGame, selectedGame }) => {
    const { t } = useTranslation();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isShowOptions, setIsShowOptions] = useState(false);

    const onSelectOption = (gameId: number) => {
        setIsShowOptions(false);
        onChangeGame(gameId);
    };

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsShowOptions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className={Styles["selector-container"]} ref={wrapperRef}>
            <div className={Styles["selected-item"]} onClick={() => setIsShowOptions(!isShowOptions)}>
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
