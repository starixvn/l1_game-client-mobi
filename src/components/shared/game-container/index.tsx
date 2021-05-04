import React, { useState, useEffect } from "react";

import GameHeader from "../game-header/game-header";
import { useSystemContext } from "../../../contexts/system";
import styles from "./game-container.module.scss";

const GameContainer: React.FC = ({ children }) => {
    const systemContext = useSystemContext();
    const { betValue } = systemContext;
    const [cursorImage, setCursorImage] = useState<string>("");
    const chipImageMapper = {
        "1": "chip-1",
        "5": "chip-2",
        "10": "chip-3",
        "20": "chip-4",
        "50": "chip-5",
        "100": "chip-6",
        "200": "chip-7",
        "500": "chip-8",
        "1000": "chip-9",
        "2000": "chip-10",
        "3000": "chip-11",
        "5000": "chip-12",
    };

    useEffect(() => {
        setCursorImage(`"/static/images/small_${chipImageMapper[betValue]}.png"`);
    }, [betValue]);

    return (
        <div className={styles["game-container"]} style={{ cursor: `url(${cursorImage}), auto` }}>
            <GameHeader />
            {children}
        </div>
    );
};

export default GameContainer;
