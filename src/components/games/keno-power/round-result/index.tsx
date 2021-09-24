import React from "react";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import TeamResult from "../../../keno/team-result";
import TeamScore from "../../../keno/team-score";
import { Result } from "../keno-power";
import styles from "./round-result.module.scss";

const sumArray = (numbers: number[]) => numbers.reduce((number, sum) => number + sum, 0);

export const RoundResult: React.FC<{ result: Result; md5: string }> = ({ result, md5 }) => {
    const { gameSetting } = useGameContext();
    const { t } = useTranslation(gameSetting.gameName.toLowerCase());
    const totalPointBlue = sumArray(result.blue);
    const totalPointRed = sumArray(result.red);
    const copyMD5ToClipboard = () => navigator.clipboard.writeText(md5);

    return (
        <>
            <div className={styles["blue-team"]}>
                <TeamResult result={result.blue} />
                <TeamScore teamName={t("blue")} score={totalPointBlue} isWin={totalPointBlue > totalPointRed} customClassName={"blue"} />
            </div>
            <div className={styles["score-wrapper"]}>
                {t("total")} <div className={styles["score"]}>{totalPointBlue + totalPointRed}</div>
            </div>
            <div className={styles["red-team"]}>
                <TeamResult result={result.red} />
                <TeamScore teamName={t("red")} score={totalPointRed} isWin={totalPointBlue < totalPointRed} customClassName={"red"} />
            </div>
            {gameSetting.supportMD5 && (
                <div className={styles["md5-section"]}>
                    <span className={styles["text"]}>{md5}</span>
                    <div className={styles["copy-box"]} onClick={copyMD5ToClipboard}>
                        <img src={`/static/images/copy.svg`} className={styles["copy-icon"]} alt="copy"></img>
                    </div>
                </div>
            )}
        </>
    );
};
