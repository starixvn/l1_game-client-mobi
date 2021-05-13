import React from "react";
import { isMobileOnly, isTablet } from "react-device-detect";
import { ChipLabelMapper, ChipMapper } from "../../common/constants";

import Styles from "./chip.module.scss";

type Props = {
    value: number;
    selected?: boolean;
    onSelected?: (value: number) => void;
    additionalClass?: string;
};

const getChipDisplayByValue = (value: number) => {
    return Object.keys(ChipLabelMapper).find((key) => ChipLabelMapper[key] === value);
};

const Chip: React.FC<Props> = ({ value, onSelected, selected = false, additionalClass }) => {
    const handleClick = () => {
        onSelected && onSelected(value);
    };

    return (
        <div
            className={`
                ${Styles.chip} ${Styles[ChipMapper[value]]} 
                ${selected ? Styles.selected : ""} 
                ${onSelected && Styles["btn-chip"]} 
                ${additionalClass ? Styles[additionalClass] : ""}
                ${isMobileOnly || isTablet ? Styles.mobile : ""}
                `}
            onClick={handleClick}
        >
            <div className={Styles["layer1"]}></div>
            <div className={Styles["layer2"]}></div>
            <div className={Styles["group-list"]}>
                <span className={`icon-chip-symbol ${Styles["symbol1"]}`}></span>
                <span className={`icon-chip-symbol ${Styles["symbol2"]}`}></span>
                <span className={`icon-chip-symbol ${Styles["symbol3"]}`}></span>
                <span className={`icon-chip-symbol ${Styles["symbol4"]}`}></span>
            </div>
            <div className={Styles["number"]}>{getChipDisplayByValue(value)}</div>
        </div>
    );
};

export default Chip;
