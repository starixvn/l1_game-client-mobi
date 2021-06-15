import React from "react";
import { ViewMode } from "../game-base/type";
import Styles from "./disabled-modal.module.scss";

const DisabledModal: React.FC<{ disabledMessage: string; viewMode: ViewMode }> = ({ disabledMessage, viewMode }) => (
    <div className={Styles["popover-container"]}>
        <div className="overlay-mask-white">
            <div className={`${Styles["disabled-modal"]} ${viewMode === ViewMode.collapse ? Styles["collapse"] : ""}`}>
                <div>{disabledMessage}</div>
            </div>
        </div>
    </div>
);

export default DisabledModal;
