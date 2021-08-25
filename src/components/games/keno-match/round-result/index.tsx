import React from "react";

import { KenoMatchGameState, Result } from "../type";
import Styles from "./draw-result.module.scss";
import HalfRoundResult from "./half-round-result";

type Props = {
    gameState: KenoMatchGameState;
    halfTimeResult: Result;
    fullTimeResult: Result;
    isHalfTimeActive: boolean;
};

export default function DrawResult(props: Props) {
    return (
        <div className={Styles["draw-result"]}>
            <div className={Styles.field}>
                <HalfRoundResult result={props.halfTimeResult} isHalfTime={true} active={props.isHalfTimeActive} />
                <HalfRoundResult result={props.fullTimeResult} isHalfTime={false} active={!props.isHalfTimeActive} />
            </div>
        </div>
    );
}
