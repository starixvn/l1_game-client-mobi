import React from "react";
import { useTranslation } from "next-i18next";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { ViewMode } from "../../../shared/game-base/type";
import { Result, SettlementResult } from "../sedie";
import Styles from "./sedie-animations.module.scss";

const Plate: React.FC = ({ children }) => {
    const { viewMode } = useGameContext();

    return (
        <div className="overlay-mask-no-bg">
            <div className={`${Styles["animation-container"]} ${viewMode === ViewMode.simple ? Styles["simple-mode"] : ""}`}>
                <div className={Styles["result-sedie-set"]}>
                    <div className={Styles["result-sedie-plate"]}></div>
                    {children}
                    <div className={Styles["result-sedie-bowl"]}></div>
                </div>
            </div>
        </div>
    );
};

export const ShakeThePlate: React.FC<{ playAnimation?: boolean }> = ({ playAnimation = false }) => (
    <div className={playAnimation ? Styles["shake-the-plate"] : ""}>
        <Plate />
    </div>
);

export const OpenThePlate: React.FC<{ result: Result }> = ({ result }) => {
    const { playResultAnimation } = useGameContext();
    return (
        <div className={`${Styles["open-the-plate"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <Plate>
                <div className={Styles["result-container"]}>
                    {Object.values(result).map((value, index) => (
                        <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                            <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                        </div>
                    ))}
                </div>
            </Plate>
        </div>
    );
};

export const SeDieResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { playResultAnimation, showResultAfterAnimation } = useGameContext();
    const { t } = useTranslation("xocxoc");
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation && Styles["has-animation"]}`}>
            {Object.values(result).map((value, index) => {
                const resultClass = `dot-3d-${index + 1}`;
                return (
                    <div className={Styles["result-item"]} key={resultClass}>
                        <div className={Styles[`dice${index + 1}`]}></div>
                        <div key={index} className={Styles[`result${index + 1}`]}>
                            <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                        </div>
                    </div>
                );
            })}
            {showResultAfterAnimation && settlementResult && (
                <div className={Styles["result-label"]}>{settlementResult?.odd ? t("odd") : t("even")}</div>
            )}
        </div>
    );
};
