import React, { useEffect, useState } from "react";
import Styles from "./base-result.module.scss";

const HidingAnimationTimeInSecond = 0.3;

export const BaseResult: React.FC<{ showResultTimeInSecond: number }> = ({ children, showResultTimeInSecond }) => {
    const [isHidingResult, setHidingResult] = useState(false);
    let hidingResultTimeOut: NodeJS.Timeout = null;

    useEffect(() => {
        hidingResultTimeOut = setTimeout(() => {
            setHidingResult(true);
        }, (showResultTimeInSecond - HidingAnimationTimeInSecond) * 1000);

        return () => {
            clearTimeout(hidingResultTimeOut);
        };
    }, []);

    return <div className={isHidingResult ? "hide-result-animation" : ""}>{children}</div>;
};
