import React from "react";
import { KenoMatchGameState, Result } from "../type";
import Styles from "./draw-result.module.scss";
import HalfRoundResult from "./half-round-result";

type Props = {
    halfTimeResult: Result;
    fullTimeResult: Result;
    activeHalfTimeResult: boolean;
    gameName: string;
};

const halfTimeProps = {
    className: "half-time",
    headerText: "Half Time",
};

const fullTimeProps = {
    className: "full-time",
    headerText: "Full Time",
};

export function PopupResult({ halfTimeResult, fullTimeResult, activeHalfTimeResult, gameName }: Props) {
    const resultProps = activeHalfTimeResult
        ? {
              ...{
                  result: halfTimeResult,
                  active: activeHalfTimeResult,
                  gameName
              },
              ...halfTimeProps,
          }
        : {
              ...{
                  result: fullTimeResult,
                  active: !activeHalfTimeResult,
                  gameName
              },
              ...fullTimeProps,
          };

    return (
        <div className={Styles["popup-result"]}>
            <HalfRoundResult {...resultProps} />
        </div>
    );
}


export function DrawHalfResult({ halfTimeResult, fullTimeResult, activeHalfTimeResult,gameName }: Props) {
    const resultProps = activeHalfTimeResult
        ? {
              ...{
                  result: halfTimeResult,
                  active: activeHalfTimeResult,
                  gameName
              },
              ...halfTimeProps,
          }
        : {
              ...{
                  result: fullTimeResult,
                  active: !activeHalfTimeResult,
                  gameName
              },
              ...fullTimeProps,
          };

    return (
        <div className={Styles["popup-result"]}>
            <HalfRoundResult {...resultProps} />
        </div>
    );
}

export function DrawFullResult({ halfTimeResult, fullTimeResult, activeHalfTimeResult,gameName}: Props) {
    return (
        <div className={Styles["draw-result"]}>
            <div className={Styles.field}>
                <HalfRoundResult
                    {...{
                        ...{
                            result: halfTimeResult,
                            active: activeHalfTimeResult,
                            gameName
                        },
                        ...halfTimeProps,
                    }}
                />
                <HalfRoundResult
                    {...{
                        ...{
                            result: fullTimeResult,
                            active: !activeHalfTimeResult,
                            gameName
                        },
                        ...fullTimeProps,
                    }}
                />
            </div>
        </div>
    );
}
