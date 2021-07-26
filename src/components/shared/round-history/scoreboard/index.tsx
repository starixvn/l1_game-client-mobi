import React, { useEffect, useRef, useState } from "react";

import Styles from "./round-history.module.scss";

type Props = {
    children: React.ReactNode;
};

const ScoreboardRoundHistory = (props: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [scrollLeftWidth, setScrollLeftWidth] = useState<number>(0);

    const handleTouchEnd = (e) => {
        updateScrollEndRight(e);
    };

    const updateScrollEndRight = (e) => {
        isScrollEndRight = e.target.scrollLeft === scrollLeftWidth;
    };

    useEffect(() => {
        const wrapperRefCurrent = wrapperRef?.current;
        let mouseDown = false;
        let startX, scrollLeft;

        const startDragging = (e) => {
            mouseDown = true;
            startX = e.pageX - e.target.offsetLeft;
            scrollLeft = e.target.scrollLeft;
        };

        const stopDragging = (e) => {
            mouseDown = false;
            isScrollEndRight = e.target.scrollLeft === scrollLeftWidth;
        };

        const handleDragging = (e) => {
            e.preventDefault();

            if (mouseDown) {
                const x: number = e.pageX - e.target.offsetLeft;
                const scroll: number = x - startX;
                e.target.scrollLeft = scrollLeft - scroll;
            }
        };

        if (wrapperRefCurrent) {
            wrapperRefCurrent.addEventListener("mousedown", startDragging);
            wrapperRefCurrent.addEventListener("mouseup", stopDragging);
            wrapperRefCurrent.addEventListener("mouseleave", stopDragging);
            wrapperRefCurrent.addEventListener("mousemove", handleDragging);
        }

        return () => {
            if (wrapperRefCurrent) {
                wrapperRefCurrent.removeEventListener("mousedown", startDragging);
                wrapperRefCurrent.removeEventListener("mouseup", stopDragging);
                wrapperRefCurrent.removeEventListener("mouseleave", stopDragging);
                wrapperRefCurrent.removeEventListener("mousemove", handleDragging);
            }
        };
    }, [scrollLeftWidth]);

    useEffect(() => {
        if (isScrollEndRight && wrapperRef?.current?.children[0]) {
            wrapperRef.current.children[0].scrollLeft = wrapperRef.current.children[0].scrollWidth;
        }

        if (wrapperRef.current) {
            setScrollLeftWidth(Math.max(scrollLeftWidth, wrapperRef?.current?.children[0]?.scrollLeft ?? 0));
        }
    }, [wrapperRef?.current?.children, scrollLeftWidth]);

    return (
        <div ref={wrapperRef} className={Styles["board"]} onTouchEnd={handleTouchEnd}>
            {props.children}
        </div>
    );
};

export default ScoreboardRoundHistory;
