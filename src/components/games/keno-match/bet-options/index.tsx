import React from "react";

import { KenoMatchGameState, KenoMatchResult } from "../type";
import Styles from "./draw-result.module.scss";
import HalfResult from "./half-result";

type Props = {
    gameState: KenoMatchGameState;
    halfTimeResult: KenoMatchResult;
    fullTimeResult: KenoMatchResult;
    isHalfTimeActive: boolean;
};

export default function DrawResult(props: Props) {
    return (
        <div className={Styles["draw-result"]}>
            <div className={Styles.field}>
                <HalfResult result={props.halfTimeResult} isHalfTime={true} active={props.isHalfTimeActive} />
                <HalfResult result={props.fullTimeResult} isHalfTime={false} active={!props.isHalfTimeActive} />
            </div>
        </div>
    );
}
