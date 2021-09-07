import React from "react";
import { Result, SettlementResult } from "../type";
import Styles from "./draw-result.module.scss";
import { HalfRoundResult, HalfResultPopup } from "./half-round-result";

interface ResultProps {
    halfTimeResult: Result;
    fullTimeResult: Result;
    isActiveLiveFullTime: boolean;
    gameName: string;
}

interface PopupResultProps extends ResultProps {
    settlementResult: SettlementResult;
}

const buildHalfMatchProps = (isActiveLiveFullTime: boolean) => {
    return { 
        className: isActiveLiveFullTime ? "full-time": "half-time", 
        headerText: isActiveLiveFullTime ? "fullTime" : "firstHalf"};
};

export function PopupResult({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName, settlementResult }: PopupResultProps) {
    const resultProps = isActiveLiveFullTime
        ? {
              ...{
                  result: fullTimeResult,
                  active: isActiveLiveFullTime,
                  settlementResult,
                  gameName,
              },
              ...buildHalfMatchProps(true),
          }
        : {
              ...{
                  result: halfTimeResult,
                  active: !isActiveLiveFullTime,
                  settlementResult,
                  gameName,
              },
              ...buildHalfMatchProps(false),
          };

    return (
        <div className={Styles["popup-result"]}>
            <HalfResultPopup {...resultProps} />
        </div>
    );
}

export function DrawFullResult({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: ResultProps) {
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
                        ...buildHalfMatchProps(false),
                    }}
                />
                <HalfRoundResult
                    {...{
                        ...{
                            result: fullTimeResult,
                            active: !isActiveLiveFullTime,
                            gameName,
                        },
                        ...buildHalfMatchProps(true),
                    }}
                />
            </div>
        </div>
    );
}
