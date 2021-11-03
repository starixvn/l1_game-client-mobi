import React from "react";

import Styles from "./ball-number.module.scss";

type Props = {
    value: number;
    hasAnimation?: boolean;
    classCustomize?: string;
};

export default function BallNumber({ value, hasAnimation, classCustomize }: Props) {
    return (
        <div
            className={`${Styles["number"]} ${hasAnimation ? Styles["has-animation"] : ""} ${classCustomize ? Styles[classCustomize] : ""}`}
            data-testid="balls-numbers"
        >
            {value || ""}
        </div>
    );
}
