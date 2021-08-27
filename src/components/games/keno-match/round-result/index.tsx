import React from "react";

import { KenoMatchGameState, Result } from "../type";
import Styles from "./draw-result.module.scss";
import HalfRoundResult from "./half-round-result";
import { HalfRoundResultProps } from "./half-round-result/half-round-result-props";

type Props = {
    gameState: KenoMatchGameState;
    halfTimeResult: Result;
    fullTimeResult: Result;
    isHalfTimeActive: boolean;
};

export function DrawHalfResult({ halfTimeResult, fullTimeResult, isHalfTimeActive }: Props) {
    const resultProps = isHalfTimeActive
        ? {
              result: halfTimeResult,
              active: isHalfTimeActive,
              className: "half-time",
              headerText: "Half Time",
          }
        : {
              result: fullTimeResult,
              active: !isHalfTimeActive,
              className: "full-time",
              headerText: "Full Time",
          };

    return <HalfRoundResult {...resultProps} />;
}

export default function DrawResult({ halfTimeResult, fullTimeResult, isHalfTimeActive }: Props) {
    const halfTimeProps: HalfRoundResultProps = {
            result: halfTimeResult,
            active: isHalfTimeActive,
            className: "half-time",
            headerText: "Half Time",
        },
        fullTimeProps: HalfRoundResultProps = {
            result: fullTimeResult,
            active: !isHalfTimeActive,
            className: "full-time",
            headerText: "Full Time",
        };

    return (
        <div className={Styles["draw-result"]}>
            <div className={Styles.field}>
                <HalfRoundResult {...halfTimeProps} />
                <HalfRoundResult {...fullTimeProps} />
            </div>
        </div>
    );
}
