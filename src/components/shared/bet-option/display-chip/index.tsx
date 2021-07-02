import React, { useRef } from "react";
import { ChipLabelMapper, ChipMapper } from "../../../../common/constants";
import styles from "./display-chip.module.scss";

const DisplayChip: React.FunctionComponent<{ chipValue: number; chipKey: number }> = ({ chipValue, chipKey }) => {
    const chipContainerStyles = useRef({
        transform: "scale(0.52)",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        ZIndex: chipKey,
        position: "absolute" as "absolute",
    });

    return (
        <div className={styles["display-chip-container"]} style={chipContainerStyles.current}>
            <img src={`/static/images/chips/${ChipMapper[chipValue]}.svg`} className={styles["chip"]} alt="dice" />
            <span className={styles["chip-value"]}>{ChipLabelMapper[chipValue]}</span>
        </div>
    );
};

export default DisplayChip;
