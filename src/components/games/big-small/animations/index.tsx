import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../big-small";
import { countRedDot } from "../big-small-helper";
import Styles from "./big-small-animations.module.scss";

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
                    {result &&
                        Object.values(result).map((value, index) => (
                            <div key={index} className={Styles[`result-${index + 1}`]}>
                                <img
                                    src={`/static/images/bigsmall-dice-${value}.png`}
                                    className={Styles["dice"]}
                                    width={30}
                                    height={30}
                                    alt="dice"
                                />
                            </div>
                        ))}
                </div>
                </Plate>
        </div>
    </div>
    );
};

export const BigSmallResultCollapse: React.FC<{ result: Result; settlementResult: SettlementResult }> = ({ result, settlementResult }) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            {result &&
                Object.values(result).map((value, index) => (
                    <div key={index} className={Styles["result-item"]}>
                        <div className={Styles[`dice${index + 1}`]}></div>
                        <div className={Styles[`result${index + 1}`]}>
                            <img
                                src={`/static/images/bigsmall-dice-${value}.png`}
                                className={`img-fluid ${Styles["dice"]}`}
                                width={33}
                                height={33}
                                alt="dice"
                            />
                        </div>
                    </div>
                ))}

            {!playResultAnimation && result && (
                <div className={`${Styles["result-label"]} ${gameSetting.id === 1 ? Styles["taixiu"] : Styles["turbo-taixiu"]}`}>
                    <span className={Styles["number-count"]}>{countRedDot(result)}</span>-
                    {` ${settlementResult.big ? t("big") : t("small")}`}
                </div>
            )}
        </div>
    );
};
