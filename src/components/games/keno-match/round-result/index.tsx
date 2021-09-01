import React from "react";
import { KenoMatchGameState, Result } from "../type";
import Styles from "./draw-result.module.scss";
import {HalfRoundResult, HalfResultPopup} from "./half-round-result";

type Props = {
    halfTimeResult: Result;
    fullTimeResult: Result;
    isActiveLiveFullTime: boolean;
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

export function PopupResult({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: Props) {
    const resultProps = isActiveLiveFullTime
        ? {
              ...{
                  result: fullTimeResult,
                  active: isActiveLiveFullTime,
                  gameName,
              },
              ...fullTimeProps,
          }
        : {
              ...{
                  result: halfTimeResult,
                  active: !isActiveLiveFullTime,
                  gameName,
              },
              ...halfTimeProps,
          };

    return (
        <div className={Styles["popup-result"]}>
            <HalfResultPopup {...resultProps} />
        </div>
    );
}

export function DrawFullResult({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: Props) {
    return (
        <div className={Styles["draw-result"]}>
            <div className={Styles.field}>
                <HalfRoundResult
                    {...{
                        ...{
                            result: halfTimeResult,
                            active: isActiveLiveFullTime,
                            gameName,
                        },
                        ...halfTimeProps,
                    }}
                />
                <HalfRoundResult
                    {...{
                        ...{
                            result: fullTimeResult,
                            active: !isActiveLiveFullTime,
                            gameName,
                        },
                        ...fullTimeProps,
                    }}
                />
            </div>
        </div>
    );
}
