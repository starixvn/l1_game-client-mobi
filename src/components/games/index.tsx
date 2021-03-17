import React from "react";

import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";

export const Games: React.FC = () => {
    
    return (
        <div className={styles["game-list"]}>
            <SeDie></SeDie>
        </div>
    );
};

export default Games;
