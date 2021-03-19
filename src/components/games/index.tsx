import React from "react";

import appSettings from "../../common/app-settings";
import styles from "./games.module.scss";
import SeDie from "./se-die/se-die";

export const Games: React.FC = () => {
    return (
        <div className={styles["game-list"]}>
            <SeDie {...appSettings.seDie} />
        </div>
    );
};

export default Games;
