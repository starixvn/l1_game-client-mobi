import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import Styles from "./odd.module.scss";

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
    return useMemo(() => {
        return (
            <div className="d-flex">
                <div className={Styles["odd-container"]}>
                    <OddItem name={"single"} number={odds["single"]}></OddItem>
                    <OddItem name={"double"} number={odds["double"]}></OddItem>
                    <OddItem name={"triple"} number={odds["triple"]}></OddItem>
                </div>
            </div>
        );
    }, [odds]);
};

export default OddComponent;
