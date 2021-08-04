import React, { useEffect, useState } from "react";
import { isDesktop } from "react-device-detect";
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

        isDesktop && hoverWrapper.current.addEventListener("mouseover", handleMouseIn);
        isDesktop && hoverWrapper.current.addEventListener("mouseout", handleMouseOut);

        return () => {
            if (hoverWrapper?.current && isDesktop) {
                hoverWrapper.current.removeEventListener("mouseover", handleMouseIn);
                hoverWrapper.current.removeEventListener("mouseout", handleMouseOut);
            }
        };
    }, [hoverWrapper]);

    return (
        <div className={`tooltip info ${showTooltip ? "show" : ""} ${Styles["tooltip-buttons"]} ${showTooltip ? Styles["show"] : ""}`}>
            <div className={`tooltip-inner ${Styles["tooltip-inner"]}`}>
                {message}
                <span className={`arrow up ${Styles["arrow"]}`}></span>
            </div>
        </div>
    );
};
