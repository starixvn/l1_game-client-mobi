import React, { useState, useEffect } from "react";

import GameHeader from "../game-header/game-header";
import { useSystemContext } from "../../../contexts/system";
import styles from "./game-container.module.scss";
import { ChipMapper } from "../../../common/constants";

const GameContainer: React.FC = ({ children }) => {
    const systemContext = useSystemContext();
    const { betValue } = systemContext;
    const [cursorImage, setCursorImage] = useState<string>("");

    useEffect(() => {
        setCursorImage(`"/static/images/small_${ChipMapper[betValue]}.png"`);
    }, [betValue]);

    return (
        <div className={styles["game-container"]} style={{ cursor: `url(${cursorImage}), auto` }}>
            <GameHeader />
            {children}
        </div>
    );
};

export default GameContainer;
