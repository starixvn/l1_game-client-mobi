import React, { useEffect, useRef } from "react";

type Props = {
    isOpen: boolean;
    onClose: Function;
};

export const ContainerToolTip: React.FC<Props> = ({ isOpen, onClose, children }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && wrapperRef) {
            const screenWidth = window.innerWidth;
            const wrapperRect = wrapperRef.current.getBoundingClientRect();
            const innerTooltip = wrapperRef.current;

            if (wrapperRect.right + 10 > screenWidth) {
                innerTooltip.setAttribute(
                    "style",
                    `transform: translateX(${screenWidth - wrapperRect.right - wrapperRect.width / 2 - 10}px)`
                );
            }

            if (wrapperRect.left < 0) {
                innerTooltip.setAttribute("style", `transform: translateX(${5 - wrapperRect.left - wrapperRect.width / 2}px)`);
            }
        }
    }, [wrapperRef.current]);

    const handleClickOutside = (event) => {
        if (isOpen && wrapperRef && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            onClose();
        }
    };

    return (
        <div className={`tooltip ${isOpen ? "show" : ""}`}>
            <div ref={wrapperRef} className="tooltip-inner">
                {children}
            </div>
            <div className="arrow"></div>
        </div>
    );
};
