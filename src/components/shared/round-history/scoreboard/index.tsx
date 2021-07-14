import React, { useEffect, useRef, useState } from "react";

import Styles from "./round-history.module.scss";

type Props = {
    children: React.ReactNode;
};

let isScrollEndRight = true;
let scrollLeftWidth = 0;

const ScoreboardRoundHistory = (props: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    let mouseDown = false;
    let startX, scrollLeft;

    const handleTouchEnd = (e) => {
        updateScrollEndRight(e);
    };

    const updateScrollEndRight = (e) => {
        if (e.target.scrollLeft === scrollLeftWidth) {
            isScrollEndRight = true;
        } else {
            isScrollEndRight = false;
        }
    };

    useEffect(() => {
        const startDragging = (e) => {
            mouseDown = true;
            startX = e.pageX - e.target.offsetLeft;
            scrollLeft = e.target.scrollLeft;
        };

        const stopDragging = () => {
            mouseDown = false;
        };

        const handleDragging = (e) => {
            e.preventDefault();
            if (!mouseDown) {
                return;
            }

            const x: number = e.pageX - e.target.offsetLeft;
            const scroll: number = x - startX;
            e.target.scrollLeft = scrollLeft - scroll;
            updateScrollEndRight(e);
        };

        if (wrapperRef.current) {
            wrapperRef.current.addEventListener("mousedown", startDragging);
            wrapperRef.current.addEventListener("mouseup", stopDragging);
            wrapperRef.current.addEventListener("mouseleave", stopDragging);
            wrapperRef.current.addEventListener("mousemove", handleDragging);
        }

        return () => {
            if (wrapperRef.current) {
                wrapperRef.current.removeEventListener("mousedown", startDragging);
                wrapperRef.current.removeEventListener("mouseup", stopDragging);
                wrapperRef.current.removeEventListener("mouseleave", stopDragging);
                wrapperRef.current.removeEventListener("mousemove", handleDragging);
            }
        };
    }, []);

    useEffect(() => {
        if (isScrollEndRight && wrapperRef?.current?.children[0]) {
            wrapperRef.current.children[0].scrollLeft = wrapperRef.current.children[0].scrollWidth;
        }

        if (wrapperRef.current) {
            scrollLeftWidth = Math.max(scrollLeftWidth, wrapperRef?.current?.children[0]?.scrollLeft);
        }
    });

    return (
        <div ref={wrapperRef} className={Styles["board"]} onTouchEnd={handleTouchEnd}>
            {props.children}
        </div>
    );
};

export default ScoreboardRoundHistory;
