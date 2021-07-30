import React, { useEffect, useState } from "react";
import Styles from "./tooltip.module.scss";

export const Tooltip: React.FC<{ message: string; hoverWrapper: React.MutableRefObject<HTMLDivElement> }> = ({ message, hoverWrapper }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const handleClick = () => {
            setShowTooltip(false);
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    useEffect(() => {
        const handleMouseIn = () => {
            setShowTooltip(true);
        };

        const handleMouseOut = () => {
            setShowTooltip(false);
        };

        hoverWrapper.current.addEventListener("mouseover", handleMouseIn);
        hoverWrapper.current.addEventListener("mouseout", handleMouseOut);

        return () => {
            hoverWrapper.current.removeEventListener("mouseover", handleMouseIn);
            hoverWrapper.current.removeEventListener("mouseout", handleMouseOut);
        };
    }, [hoverWrapper]);

    return (
        <div className={`tooltip mini-round-history ${showTooltip ? "show" : ""} ${Styles["tooltip-container"]}`}>
            <div className="tooltip-inner">{message}</div>
            <span className={"arrow down"}></span>
        </div>
    );
};
