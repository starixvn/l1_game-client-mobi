import React, { useRef } from "react";
import { ChipLabelMapper, ChipMapper } from "../../../../common/constants";
import styles from "./display-chip.module.scss";

const DisplayChip: React.FunctionComponent<{ chipValue: number; chipKey: number }> = ({ chipValue, chipKey }) => {
    const chipContainerStyles = useRef({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        ZIndex: chipKey,
        position: "absolute" as "absolute",
    });

    return (
        <div className={`${styles["chip-container"]} ${styles[ChipMapper[chipValue]]}`} style={chipContainerStyles.current}>
            <img src={`/static/images/chips/${ChipMapper[chipValue]}.svg`} className={styles["chip"]} alt="dice" />
            <span className={styles["value"]}>{ChipLabelMapper[chipValue]}</span>
        </div>
    );
};

export default DisplayChip;
