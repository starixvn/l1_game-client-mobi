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
        <div className={`${Styles.chip} ${selected ? Styles.highlight : ""}`} onClick={handleClick}>
            {display}
        </div>
    );
};

export default Chip;
