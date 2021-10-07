import { useTranslation } from "next-i18next";
import React, { useEffect, useRef, useState } from "react";

import appSettings from "../../../common/app-settings";
import { GameResourceKeys } from "../../../common/resources";
import Styles from "./game-selector.module.scss";

export const GameSelector: React.FC<{ onChangeGame: Function; selectedGame: number; offerGames: number[] }> = ({
    onChangeGame,
    selectedGame,
    offerGames,
}) => {
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
        <div className={Styles["selector-container"]} ref={wrapperRef} data-testid="game-selector">
            <div data-testid="selected-item" className={Styles["selected-item"]} onClick={() => setIsShowOptions(!isShowOptions)}>
                {t(`${appSettings.gameSettings[selectedGame].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
            </div>
            {isShowOptions && (
                <div className={Styles["dropdown-menu"]} data-testid="dropdown-menu">
                    {appSettings.offeredGames
                        .filter((game) => offerGames.includes(game))
                        .map((id) => (
                            <div className={Styles["dropdown-item"]} key={id} onClick={() => onSelectOption(id)} data-testid="dropdown-item">
                                {t(`${appSettings.gameSettings[id].gameName.toLocaleLowerCase()}:${GameResourceKeys.GAME_NAME}`)}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default GameSelector;
