import React from "react";
import Styles from "./chip-slider.module.scss";
import { useSystemContext } from "../../../contexts/system";
import { ChipImage } from "./chip-image";

export const Chip: React.FC<{
    value: number;
    text: string;
    color: string;
    selectedChip: number;
    onClickChip: Function;
}> = ({ value, text, color, selectedChip, onClickChip }) => {
    const { enabledQuickBet } = useSystemContext();

    return (
        <div
            className={`${Styles["chip-container"]} ${selectedChip === value ? Styles["selected"] : ""} ${
                enabledQuickBet ? Styles["enabled-quick-bet"] : ""
            }`}
            onClick={() => onClickChip(value)}
        >
            <ChipImage className={`img-fluid ${Styles["chip"]}`} width="60" height="62" color={color} />
            <span className={Styles["value"]}>{text}</span>
        </div>
    );
};
