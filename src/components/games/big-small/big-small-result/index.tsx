import { useTranslation } from "next-i18next";
import Image from "next/image";
import React from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { Result, SettlementResult } from "../big-small";
import { countRedDot } from "../big-small-helper";
import Styles from "./big-small-result.module.scss";

const BigSmallResult: React.FC<{ result?: Result }> = ({ result }) => {
    const { playResultAnimation } = useGameContext();

    return (
        <div className={`${Styles["container"]} ${Styles["normal-mode"]}`}>
            <div className="overlay-mask">
                <div className={`${Styles["animation-container"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
                    {<div className={Styles["result-plate"]}></div>}
                    <div className={Styles["toss-dices"]}>
                        <Image
                            key={Date.now()}
                            src={`/static/images/bigsmall_dice.gif?${new Date().getTime()}`}
                            alt="shake"
                            width={180}
                            height={180}
                            layout="intrinsic"
                        />
                    </div>
                    <div className={Styles["result-container"]}>
                        {result &&
                            Object.values(result).map((value, index) => (
                                <div key={index} className={Styles[`result-${index + 1}`]}>
                                    <img src={`/static/images/bigsmall-dice-${value}.png`} className={Styles["dice"]} alt="dice" />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BigSmallResultCollapse: React.FC<{ result?: Result; settlementResult?: SettlementResult }> = ({
    result,
    settlementResult,
}) => {
    const { playResultAnimation, gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    return (
        <div className={`${Styles["result-collapse-mode"]} ${playResultAnimation ? Styles["has-animation"] : ""}`}>
            {result &&
                Object.values(result).map((value, index) => (
                    <div key={index} className={Styles["result-item"]}>
                        <div className={Styles[`dice${index + 1}`]}></div>
                        <div className={Styles[`result${index + 1}`]}>
                            <img src={`/static/images/bigsmall-dice-${value}.png`} className={`img-fluid ${Styles["dice"]}`} alt="dice" />
                        </div>
                    </div>
                ))}

            {!playResultAnimation && result && (
                <div
                    className={`${Styles["result-label"]} ${gameSetting.id === 1 ? Styles["taixiu"] : Styles["turbo-taixiu"]}`}
                >{`${countRedDot(result)} - ${settlementResult.big ? t("big") : t("small")}`}</div>
            )}
        </div>
    );
};

export default BigSmallResult;
