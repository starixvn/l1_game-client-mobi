import React, { useEffect, useRef } from "react";
import Styles from "./round-history.module.scss";

type Props = {
    children: React.ReactNode;
};

const ScoreboardRoundHistory = (props: Props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const scrollWrapperCurrent = wrapperRef.current;
    let mouseDown = false;
    let startX, scrollLeft;

    const handleWheel = (e) => {
        e.target.scrollLeft -= e.deltaY;
    };

    const startDragging = (e) => {
        mouseDown = true;
        startX = e.pageX - e.target.offsetLeft;
        scrollLeft = e.target.scrollLeft;
    };

    const stopDragging = (e) => {
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
    };

    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.children[0].scrollLeft = wrapperRef.current.children[0].scrollWidth;
            wrapperRef.current.onwheel = handleWheel;
            wrapperRef.current.onmousedown = startDragging;
            wrapperRef.current.onmouseup = stopDragging;
            wrapperRef.current.onmouseleave = stopDragging;
            wrapperRef.current.onmousemove = handleDragging;
        }
    }, [scrollWrapperCurrent]);

    return <div ref={wrapperRef}>{props.children}</div>;
};

export default ScoreboardRoundHistory;
