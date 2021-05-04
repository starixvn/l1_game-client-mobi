import React from "react";
import Styles from "./landscape-mode.module.scss";

const LandscapeMode = () => {
    return (
        <div className={Styles["landscape-mode"]}>
            <img src="/static/images/landscape-icon.svg" />
        </div>
    );
};

export default LandscapeMode;
