import React from "react";

import Styles from "./balls-numbers.module.scss";

const BallsNumbers: React.FC<{ number: number | string; isBetHistory?: boolean }> = ({ number, isBetHistory = false }) => {
    return (
        <div className={`${Styles["number"]} ${isBetHistory ? Styles["bet-history"] : ""}`} data-testid="balls-numbers">
            {number}
        </div>
    );
};

export default BallsNumbers;
