import React, { useState } from "react";

import { GameState } from "../game-base/type";
import GameHeader from "../game-header/game-header";
import styles from "./game-container.module.scss";
import { PopupContextProvider } from "../../../contexts/popup-context";
import { useTranslation } from "next-i18next";
import BaseModal from "../base-modal";
import SeDieGuide from "../../game-guide/se-die/en";
import BauCuaGuide from "../../game-guide/fish-prawn-crab/en";
import BigSmallGuide from "../../game-guide/big-small/en";
import SeDieBetHistory from "../../games/se-die/bet-history";
import FishPrawnCrabBetHistory from "../../games/fish-prawn-crab/bet-history";

type Props = {
    gameId: number;
    gameName: string;
    roundId: number;
    remainingTime: number;
    gameState: GameState;
    children: React.ReactNode;
    apiUrl: string;
};

const GameContainer: React.FC<Props> = (props) => {
    const { gameName, roundId, gameState, remainingTime, gameId, apiUrl } = props;
    const { t } = useTranslation(gameName.toLowerCase());
    const [isOpenGameGuide, setOpenGameGuide] = useState<boolean>(false);
    const [isOpenBetHistory, setOpenBetHistory] = useState<boolean>(false);

    const updatePopupGuideState = () => {
        setOpenGameGuide(!isOpenGameGuide);
    };
    const updatePopupBetHistoryState = () => {
        setOpenBetHistory(!isOpenBetHistory);
    };

    const renderGameGuide = () => {
        switch (gameId) {
            case 1:
                return <BigSmallGuide />;
            case 2:
                return <SeDieGuide />;
            case 3:
                return <BauCuaGuide />;
            default:
                return null;
        }
    };

    const renderGameHistory = () => {
        switch (gameId) {
            case 2:
                return <SeDieBetHistory />;
            case 3:
                return <FishPrawnCrabBetHistory />;
            default:
                return null;
        }
    };

    const popupContext = {
        handleShowPopupGuide: updatePopupGuideState,
        handleShowPopupBetHistory: updatePopupBetHistoryState,
    };
    return (
        <div className={styles["game-container"]}>
            <PopupContextProvider value={popupContext}>
                <GameHeader
                    gameId={gameId}
                    gameName={gameName}
                    roundId={roundId}
                    gameState={gameState}
                    remainingTime={remainingTime}
                    apiUrl={apiUrl}
                />
                {props.children}
                {isOpenGameGuide && (
                    <BaseModal title={t("titleModalGameGuide")} isOpen={isOpenGameGuide} onCloseModal={() => setOpenGameGuide(false)}>
                        {renderGameGuide()}
                    </BaseModal>
                )}
                {isOpenBetHistory && (
                    <BaseModal title={t("titleModalGameGuide")} isOpen={isOpenBetHistory} onCloseModal={() => setOpenBetHistory(false)}>
                        {renderGameHistory()}
                    </BaseModal>
                )}
            </PopupContextProvider>
        </div>
    );
};

export default GameContainer;
