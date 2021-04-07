import React from "react";

import Styles from "./chip.module.scss";

type Props = {
    display: string;
    value: number;
    selected?: boolean;
    onSelected: (value: number) => void;
};

const Chip: React.FC<Props> = ({ display, value, onSelected, selected = false }) => {
    const handleClick = () => {
        onSelected(value);
    };

    return (
        <div className={`${Styles.chip} ${selected ? Styles.selected : ""}`} onClick={handleClick}>
            <div className={Styles["layer1"]}></div>
            <div className={Styles["layer2"]}></div>
            <div className={Styles["group-list"]}>
                <span className={`icon-chip-symbol ${Styles["symbol1"]}`}></span>
                <span className={`icon-chip-symbol ${Styles["symbol2"]}`}></span>
                <span className={`icon-chip-symbol ${Styles["symbol3"]}`}></span>
                <span className={`icon-chip-symbol ${Styles["symbol4"]}`}></span>
            </div>
            <div className={Styles["number"]}>{display}</div>
        </div>
    );
};

export default Chip;
