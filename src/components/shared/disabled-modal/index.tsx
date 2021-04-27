import React from "react";

import Styles from "./disabled-modal.module.scss";

const DisabledModal: React.FC<{ disabledMessage: string }> = ({ disabledMessage }) => (
    <div className={Styles["popover-container"]}>
        <div className="overlay-mask-white"></div>
        <div className={Styles["popover-content"]}>
            <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
            <div className={Styles.message}>{disabledMessage}</div>
        </div>
    </div>
);

export default DisabledModal;
