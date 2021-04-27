import React from "react";
import Styles from "./disabled-modal.module.scss";

type Props = {
    disabledMessage: string;
};

const DisabledModal: React.FC<Props> = ({ disabledMessage }) => (
    <div className={Styles["popover-container"]}>
        <div className="overlay-mask-white"></div>
        <div className={Styles["popover-content"]}>
            <div className={`icon-warning ${Styles["icon-warning"]}`}></div>
            <div className={Styles.message}>Game đang được bảo trì, vui lòng quay lại sau 10 phút.</div>
        </div>
    </div>
);

export default DisabledModal;
