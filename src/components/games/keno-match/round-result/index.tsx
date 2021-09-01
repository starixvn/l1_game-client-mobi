import React from "react";
import { KenoMatchGameState, Result } from "../type";
import Styles from "./draw-result.module.scss";
import HalfRoundResult from "./half-round-result";

type Props = {
    halfTimeResult: Result;
    fullTimeResult: Result;
    isActiveFullTime: boolean;
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

export function PopupResult({ halfTimeResult, fullTimeResult, isActiveFullTime, gameName }: Props) {
    const resultProps = isActiveFullTime
        ? {
              ...{
                  result: fullTimeResult,
                  active: isActiveFullTime,
                  gameName,
              },
              ...fullTimeProps,
          }
        : {
              ...{
                  result: halfTimeResult,
                  active: !isActiveFullTime,
                  gameName,
              },
              ...halfTimeProps,
          };

    return (
        <div className={Styles["popup-result"]}>
            <HalfRoundResult {...resultProps} />
        </div>
    );
}

export function DrawFullResult({ halfTimeResult, fullTimeResult, isActiveFullTime, gameName }: Props) {
    return (
        <div className={Styles["draw-result"]}>
            <div className={Styles.field}>
                <HalfRoundResult
                    {...{
                        ...{
                            result: halfTimeResult,
                            active: isActiveFullTime,
                            gameName,
                        },
                        ...halfTimeProps,
                    }}
                />
                <HalfRoundResult
                    {...{
                        ...{
                            result: fullTimeResult,
                            active: !isActiveFullTime,
                            gameName,
                        },
                        ...fullTimeProps,
                    }}
                />
            </div>
        </div>
    );
}
