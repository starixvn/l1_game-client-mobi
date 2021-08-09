import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import { useGameContext } from "../../../../contexts/game-context/game-context";
import { RoundDot } from "../../../shared/round-history/dot";
import { Result, SettlementResult } from "../sedie";
import Styles from "./sedie-animations.module.scss";

const Plate: React.FC = ({ children }) => {
    return (
        <div className={`${Styles["animation-container"]}`}>
            <div className={Styles["result-sedie-set"]}>
                <div className={Styles["result-sedie-plate"]}></div>
                {children}
                <div className={Styles["result-sedie-bowl"]}></div>
            </div>
        </div>
    );
};

export const ShakeThePlate: React.FC<{ playAnimation?: boolean; roundId: number }> = ({ playAnimation = false, roundId }) =>
    useMemo(
        () => (
            <div className={playAnimation ? Styles["shake-the-plate"] : ""}>
                <div className="overlay-mask-no-bg">
                    <Plate />
                </div>
            </div>
        ),
        [roundId]
    );

export const OpenThePlate: React.FC<{ result: Result }> = ({ result }) => {
    const { playResultAnimation } = useGameContext();
    return (
        <div className={`${Styles["open-the-plate"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className="overlay-mask">
                <Plate>
                    <div className={Styles["result-container"]}>
                        {Object.values(result).map((value, index) => (
                            <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                                <RoundDot choice={value ? "odd" : "even"} size="super-large" />
                            </div>
                        ))}
                    </div>
                </Plate>
            </div>
        </div>
    );
};

export const SeDieResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { playResultAnimation } = useGameContext();
    const { t } = useTranslation("xocxoc");
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            <div className={Styles["result-container"]}>
                {Object.values(result).map((value, index) => {
                    const resultClass = `dot-3d-${index + 1}`;
                    return (
                        <div className={Styles["result-item"]} key={resultClass}>
                            <div className={`${Styles[resultClass]} ${index % 2 ? Styles["option1"] : Styles["option2"]}`}>
                                <span className={Styles["dot-3d-front-inside"]}></span>
                                <span className={Styles["dot-3d-front"]}></span>
                                <span className={Styles["dot-3d-back_inside"]}></span>
                                <span className={Styles["dot-3d-back"]}></span>
                            </div>
                            <div key={index} className={Styles[`result-sedie-dot${index + 1}`]}>
                                <div className={`${value ? Styles["result-dot-red"] : Styles["result-dot-white"]}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {!playResultAnimation && settlementResult && (
                <div className={Styles["result-label"]}>{settlementResult?.odd ? t("odd") : t("even")}</div>
            )}
        </div>
    );
};
