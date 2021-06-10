import React, { useEffect, useRef, useState } from "react";

import { useSystemContext } from "../../../../contexts/system";
import Chip from "../../chip";
import styles from "./display-chip.module.scss";

const DisplayChip: React.FunctionComponent<{ chipValue: number; chipKey: number }> = ({ chipValue, chipKey }) => {
    const [audio] = useState(new Audio("./static/sounds/place-bet.mp3"));
    const { enabledPlaySound } = useSystemContext();
    const chipContainerStyles = useRef({
        transform: "scale(0.52)",
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        ZIndex: chipKey,
        position: "absolute" as "absolute",
    });
    useEffect(() => {
        enabledPlaySound && audio.play();
        return () => {
            audio.pause();
        };
    }, []);

    return (
        <div className={styles["display-chip-container"]} style={chipContainerStyles.current}>
            <Chip key={`chip-${chipValue}-${chipKey}`} value={chipValue} additionalClass={"dropAnimation"} />
        </div>
    );
};

export default DisplayChip;
