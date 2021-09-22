import React from "react";

import Styles from "./balls-numbers.module.scss";

const BallsNumbers: React.FC<{ number: number | string; isBetHistory?: boolean; isAnimation?: boolean }> = ({
    number,
    isBetHistory = false,
    isAnimation,
}) => {
    return (
        <div
            className={`${Styles["number"]} ${isBetHistory ? Styles["bet-history"] : ""} ${isAnimation ? Styles["has-animation"] : ""}`}
            data-testid="balls-numbers"
        >
            {number}
        </div>
    );
};

export default BallsNumbers;
