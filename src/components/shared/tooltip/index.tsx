import React, { useEffect, useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import Styles from "./tooltip.module.scss";

export const Tooltip: React.FC<{ message: string; hoverWrapper: React.MutableRefObject<HTMLDivElement>; isShowAtHoverPosition?: boolean }> =
    ({ message, hoverWrapper, isShowAtHoverPosition }) => {
        const [showTooltip, setShowTooltip] = useState(false);
        const [customStyle, setCustomStyle] = useState<React.CSSProperties>(null);
        const wrapperRef = useRef<HTMLDivElement>(null);

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
            if (wrapperRef.current) {
                const wrapperLeftPosition = wrapperRef.current.getBoundingClientRect().x;
                !isShowAtHoverPosition && wrapperLeftPosition < 0 && setCustomStyle({ left: -60, right: "auto" });
            }
        }, [wrapperRef]);

        useEffect(() => {
            let timeOut: NodeJS.Timeout = null;
            const mousePosition = {
                x: 0,
                y: 0,
            };

            const handleMouseIn = () => {
                if (isShowAtHoverPosition && !showTooltip) {
                    timeOut = setTimeout(() => {
                        setCustomStyle({ position: "fixed", left: mousePosition.x + 20, top: mousePosition.y + 20, right: "auto" });
                        console.log("mouse in");
                    }, 500);
                }
                setShowTooltip(true);
            };

            const handleMouseOut = () => setShowTooltip(false);
            const handleMouseMove = (event: MouseEvent) => {
                mousePosition.x = event.clientX;
                mousePosition.y = event.clientY;
            };

            isDesktop && hoverWrapper.current.addEventListener("mouseover", handleMouseIn);
            isDesktop && hoverWrapper.current.addEventListener("mouseleave", handleMouseOut);
            isDesktop && isShowAtHoverPosition && document.addEventListener("mousemove", handleMouseMove);

            return () => {
                if (hoverWrapper?.current && isDesktop) {
                    hoverWrapper.current.removeEventListener("mouseover", handleMouseIn);
                    hoverWrapper.current.removeEventListener("mouseleave", handleMouseOut);
                }

                isDesktop && isShowAtHoverPosition && document.addEventListener("mousemove", handleMouseMove);
                clearTimeout(timeOut);
            };
        }, [hoverWrapper, showTooltip]);

        return (
            <div className={`tooltip info ${showTooltip ? "show" : ""} ${Styles["tooltip-buttons"]} ${showTooltip ? Styles["show"] : ""}`}>
                <div ref={wrapperRef} style={customStyle} className={`tooltip-inner ${Styles["tooltip-inner"]}`}>
                    {message}
                </div>
                {!isShowAtHoverPosition && <span className={`arrow up ${Styles["arrow"]}`}></span>}
            </div>
        );
    };
