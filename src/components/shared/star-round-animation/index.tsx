import React from "react";

import Styles from "./start-round-animation.module.scss";

const StartRoundAnimation = () => {
    return (
        <div className={Styles["start-round-container"]}>
            <div className={Styles["start-round-content"]}>Bắt đầu phiên mới</div>
        </div>
    );
};

export default StartRoundAnimation;
