import React from "react";

import Styles from "./ball-number.module.scss";

type Props = {
    value: number;
    hasAnimation: boolean;
};

export default function BallNumber({ value, hasAnimation }: Props) {
    return (
        <div className={`${Styles["number"]} ${hasAnimation ? Styles["has-animation"] : ""}`} data-testid="balls-numbers">
            {value || ""}
        </div>
    );
}
