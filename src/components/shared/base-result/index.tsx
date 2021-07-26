import React, { useEffect, useState } from "react";

const HidingAnimationTimeInSecond = 0.5;

export const BaseResult: React.FC<{ showResultTimeInSecond: number }> = ({ children, showResultTimeInSecond }) => {
    const [isHidingResult, setHidingResult] = useState(false);

    useEffect(() => {
        const hidingResultTimeOut = setTimeout(() => {
            setHidingResult(true);
        }, (showResultTimeInSecond - HidingAnimationTimeInSecond) * 1000);

        return () => {
            clearTimeout(hidingResultTimeOut);
        };
    }, [showResultTimeInSecond]);

    return <div className={isHidingResult ? "hide-result-animation" : ""}>{children}</div>;
};
