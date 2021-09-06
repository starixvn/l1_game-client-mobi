import React from "react";
import { KenoMatchGameState, Result } from "../type";
import Styles from "./draw-result.module.scss";
import { HalfRoundResult, HalfResultPopup } from "./half-round-result";
import { useTranslation } from "next-i18next";

interface Props {
    halfTimeResult: Result;
    fullTimeResult: Result;
    isActiveLiveFullTime: boolean;
    gameName: string;
}

const buildHalfMatchProps = (isActiveLiveFullTime: boolean, headerText: string, gameName: string) => {
    return isActiveLiveFullTime
        ? {
              className: "full-time",
              headerText
          }
        : {
              className: "half-time",
              headerText
          };
};

export function PopupResult({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: Props) {
    const { t } = useTranslation(gameName.toLowerCase());
    const resultProps = isActiveLiveFullTime
        ? {
              ...{
                  result: fullTimeResult,
                  active: isActiveLiveFullTime,
                  gameName,
              },
              ...buildHalfMatchProps(true, t(`${gameName}:fullTime`), gameName),
          }
        : {
              ...{
                  result: halfTimeResult,
                  active: !isActiveLiveFullTime,
                  gameName,
              },
              ...buildHalfMatchProps(false, t(`${gameName}:firstHalf`), gameName),
          };

    return (
        <div className={Styles["popup-result"]}>
            <HalfResultPopup {...resultProps} />
        </div>
    );
}

export function DrawFullResult({ halfTimeResult, fullTimeResult, isActiveLiveFullTime, gameName }: Props) {
    const { t } = useTranslation([gameName.toLowerCase()]);
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
                        ...buildHalfMatchProps(false, t(`${gameName}:firstHalf`), gameName),
                    }}
                />
                <HalfRoundResult
                    {...{
                        ...{
                            result: fullTimeResult,
                            active: !isActiveLiveFullTime,
                            gameName,
                        },
                        ...buildHalfMatchProps(true, t(`${gameName}:fullTime`), gameName),
                    }}
                />
            </div>
        </div>
    );
}
