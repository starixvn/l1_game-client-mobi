import React, { useRef } from "react";
import Chip from "../../../chip";

const DisplayChip: React.FunctionComponent<{ chipValue: number; chipKey: number }> = ({ chipValue, chipKey }) => {
    const displayChipStyles = useRef({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        ZIndex: chipKey,
        transform: "scale(0.6)",
        position: "absolute" as "absolute",
    });

    return (
        <Chip
            key={`chip-${chipValue}-${chipKey}`}
            value={chipValue}
            customStyle={displayChipStyles.current}
            additionalClass={"dropAnimation"}
        />
    );
};

export default DisplayChip;
