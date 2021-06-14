import React from "react";
import { ModeView } from "../game-base/type";
import Styles from "./disabled-modal.module.scss";

const DisabledModal: React.FC<{ disabledMessage: string; modeView: ModeView }> = ({ disabledMessage, modeView }) => (
    <div className={Styles["popover-container"]}>
        <div className="overlay-mask-white">
            <div className={`${Styles["disabled-modal"]} ${modeView === ModeView.collapse ? Styles["collapse"] : ""}`}>
                <div>{disabledMessage}</div>
            </div>
        </div>
    </div>
);

export default DisabledModal;
