import React from "react";
import Styles from "./locking-bet.module.scss";

const LockingBet: React.FC = () => (
    <div className="overlay-mask-white">
        <div className={Styles["mini-notice"]}>{"Dừng nhận cược"}</div>
    </div>
);

export default LockingBet;
