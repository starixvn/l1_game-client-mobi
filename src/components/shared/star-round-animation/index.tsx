import React from "react";

import Styles from "./start-round-animation.module.scss";

const StartRoundAnimation = () => {
    return (
        <div>
            <div className="overlay-mask"></div>
            <div className={Styles["start-round-container"]}>
                <div className={Styles["start-round-content"]}>Bắt đầu phiên mới</div>
            </div>
        </div>
    );
};

export default StartRoundAnimation;
