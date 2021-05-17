import React from "react";

import GameHeader from "../game-header/game-header";
import styles from "./game-container.module.scss";

const GameContainer: React.FC = ({ children }) => {
    return (
        <div className={styles["game-container"]}>
            <GameHeader />
            {children}
        </div>
    );
};

export default GameContainer;
