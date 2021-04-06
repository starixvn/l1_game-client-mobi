import React from "react";
import Styles from "./odd.module.scss";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { useTranslation } from "next-i18next";

const OddItem = ({ name, number }) => {
    const { t } = useTranslation("baucua");
    return (
        <div className={Styles["odd-item"]}>
            <span className={Styles.type}>{t(name)}</span>
            <span className={Styles.value}>1:{number}</span>
        </div>
    );
};

const OddComponent: React.FunctionComponent = () => {
    const { gameConfigs } = useGameContext();
    const { odds } = gameConfigs;
    return (
        <div className={Styles.layout}>
            <div className={Styles["odd-container"]}>
                <OddItem name={"single"} number={odds.single}></OddItem>
                <OddItem name={"double"} number={odds.double}></OddItem>
                <OddItem name={"triple"} number={odds.triple}></OddItem>
            </div>
        </div>
    );
};

export default OddComponent;
