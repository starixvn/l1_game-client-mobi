import React from "react";

import Styles from "./disabled-modal.module.scss";

const DisabledModal: React.FC<{ disabledMessage: string }> = ({ disabledMessage }) => (
    <div className={Styles["popover-container"]}>
        <div className="overlay-mask-white">
            <div className={Styles["mini-notice"]}>
                <div>{disabledMessage}</div>
            </div>
        </div>
    </div>
);

export default DisabledModal;
