import React from "react";
import Styles from "./round-history.module.scss";

type Props = {
    children: React.ReactNode;
};

const ScoreboardRoundHistory = (props: Props) => {
    const handleWheel = (e) => {
        e.target.scrollLeft -= e.deltaY;
    };

    let mouseDown = false;
    let startX, scrollLeft;
    let startDragging = function (e) {
        mouseDown = true;
        startX = e.pageX - e.target.offsetLeft;
        scrollLeft = e.target.scrollLeft;
    };
    let stopDragging = function (e) {
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

    return (
        <div
            onWheel={(e) => handleWheel(e)}
            onMouseDown={(e) => startDragging(e)}
            onMouseUp={(e) => stopDragging(e)}
            onMouseLeave={(e) => stopDragging(e)}
            onMouseMove={(e) => handleDragging(e)}
        >
            {props.children}
        </div>
    );
};

export default ScoreboardRoundHistory;
