import React, { useState, useEffect, useRef } from "react";
import { GameState } from "../../game-base/type";
import Styles from "./round-history.module.scss";

type Props = {
    gameState: GameState;
    children: React.ReactNode;
};

const ScoreboardRoundHistory = (props: Props) => {
    const { gameState } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isScrollEndRight, setIsScrollEndRight] = useState<boolean>(true);
    const [scrollLeftWidth, setScrollLeftWidth] = useState<number>(0);
    let mouseDown = false;
    let startX, scrollLeft;
    const handleWheel = (e) => {
        e.target.scrollLeft -= e.deltaY;
        updateScrollEndRight(e);
    };

    const handleScroll = (e) => {
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
            wrapperRef.current.onscroll = handleScroll;
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
        if (wrapperRef.current && gameState === GameState.DisplayResult) {
            setScrollLeftWidth(Math.max(scrollLeftWidth, wrapperRef.current.children[0].scrollLeft));
        }
    });

    return (
        <div ref={wrapperRef} className={Styles["board"]}>
            {props.children}
        </div>
    );
};

export default ScoreboardRoundHistory;
