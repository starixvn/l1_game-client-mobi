import React, { useState, useEffect, useRef } from "react";
import { useGameContext } from "../../../../contexts/game-context/game-context";
import { ViewMode } from "../../game-base/type";
import Styles from "./round-history.module.scss";

type Props = {
    children: React.ReactNode;
};

const ScoreboardRoundHistory = (props: Props) => {
    const { viewMode } = useGameContext();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isScrollEndRight, setIsScrollEndRight] = useState<boolean>(true);
    const [scrollLeftWidth, setScrollLeftWidth] = useState<number>(0);
    let mouseDown = false;
    let startX, scrollLeft;
    const handleWheel = (e) => {
        e.preventDefault();
        e.target.scrollLeft += e.deltaY;
        updateScrollEndRight(e);
    };

    const handleTouchEnd = (e) => {
        updateScrollEndRight(e);
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
        updateScrollEndRight(e);
    };

    const updateScrollEndRight = (e) => {
        if (e.target.scrollLeft === scrollLeftWidth) {
            setIsScrollEndRight(true);
        } else {
            setIsScrollEndRight(false);
        }
    };

    useEffect(() => {
        if (wrapperRef.current) {
            wrapperRef.current.onwheel = handleWheel;
            wrapperRef.current.onmousedown = startDragging;
            wrapperRef.current.onmouseup = stopDragging;
            wrapperRef.current.onmouseleave = stopDragging;
            wrapperRef.current.onmousemove = handleDragging;
        }
    }, [scrollLeftWidth]);

    useEffect(() => {
        if (isScrollEndRight) {
            wrapperRef.current.children[0].scrollLeft = wrapperRef.current.children[0].scrollWidth;
        }

        if (wrapperRef.current) {
            setScrollLeftWidth(Math.max(scrollLeftWidth, wrapperRef.current.children[0].scrollLeft));
        }
    });

    useEffect(() => {
        return () => {
            wrapperRef.current = null;
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className={viewMode === ViewMode.simple ? Styles["board-inline"] : Styles["board"]}
            onTouchEnd={handleTouchEnd}
        >
            {props.children}
        </div>
    );
};

export default ScoreboardRoundHistory;
