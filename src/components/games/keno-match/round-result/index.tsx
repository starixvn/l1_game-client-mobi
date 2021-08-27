import React from "react";
import { KenoMatchGameState, Result } from "../type";
import Styles from "./draw-result.module.scss";
import HalfRoundResult from "./half-round-result";

type Props = {
    gameState: KenoMatchGameState;
    halfTimeResult: Result;
    fullTimeResult: Result;
    activeHalfTimeResult: boolean;
};

const halfTimeProps = {
    className: "half-time",
    headerText: "Half Time",
};

const fullTimeProps = {
    className: "full-time",
    headerText: "Full Time",
};

export function DrawHalfResult({ halfTimeResult, fullTimeResult, activeHalfTimeResult }: Props) {
    const resultProps = activeHalfTimeResult
        ? {
              ...{
                  result: halfTimeResult,
                  active: activeHalfTimeResult,
              },
              ...halfTimeProps,
          }
        : {
              ...{
                  result: fullTimeResult,
                  active: !activeHalfTimeResult,
              },
              ...fullTimeProps,
          };

    return (
        <div className={Styles["popup-result"]}>
            <HalfRoundResult {...resultProps} />
        </div>
    );
}

export function DrawFullResult({ halfTimeResult, fullTimeResult, activeHalfTimeResult }: Props) {
    return (
        <div className={Styles["draw-result"]}>
            <div className={Styles.field}>
                <HalfRoundResult
                    {...{
                        ...{
                            result: halfTimeResult,
                            active: activeHalfTimeResult,
                        },
                        ...halfTimeProps,
                    }}
                />
                <HalfRoundResult
                    {...{
                        ...{
                            result: fullTimeResult,
                            active: !activeHalfTimeResult,
                        },
                        ...fullTimeProps,
                    }}
                />
            </div>
        </div>
    );
}
