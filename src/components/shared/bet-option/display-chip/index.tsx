import React, { useRef } from "react";
import { ChipMapper } from "../../../../common/constants";
import styles from "./display-chip.module.scss";

const DisplayChip: React.FunctionComponent<{ chipValue: number; chipKey: number }> = ({ chipValue, chipKey }) => {
    const displayChipStyles = useRef({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        "z-index": chipKey,
    });

    return (
        <img
            key={`chip-${chipValue}-${chipKey}`}
            className={styles["chip"]}
            src={`/static/images/small_${ChipMapper[chipValue]}.png`}
            style={displayChipStyles.current}
        ></img>
    );
};

export default DisplayChip;
