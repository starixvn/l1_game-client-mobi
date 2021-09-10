import React, { useEffect, useState } from "react";
import { Result, SettlementResult } from "../type";
import Styles from "./draw-result.module.scss";
import { HalfRoundResult } from "./half-round-result";
import { HalfRoundResultPopup } from "./half-round-result/half-round-result-popup";

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
        className: isActiveLiveFullTime ? "full-time" : "half-time",
        headerText: isActiveLiveFullTime ? "fullTime" : "firstHalf",
    };
};

export const PopupResult: React.FC<PopupResultProps> = ({
    halfTimeResult,
    fullTimeResult,
    isActiveLiveFullTime,
    gameName,
    settlementResult,
}: PopupResultProps) => {
    const emptyResult = { blue: [], red: [] };
    const [resultProps, setResultProps] = useState(null);
    const [fullTimeResultAnimation, setFullTimeResultAnimation] = useState(emptyResult);
    const [halfTimeResultAnimation, setHalfTimeResultAnimation] = useState(emptyResult);

    useEffect(() => {
        let index = 0;
        
        function doAnimation() {
            if (index === halfTimeResult.blue.length) {
                clearInterval(timerId);
                return;
            }

            const showSettlement = index === halfTimeResult.blue.length - 1,
            progressBarStyle = `open-ball-${index + 1}`;

            if (isActiveLiveFullTime) {
                setFullTimeResultAnimation(prev => {
                    prev.blue.push(fullTimeResult.blue[index]);
                    prev.red.push(fullTimeResult.red[index]);

                    return prev;
                });
                
                setResultProps({
                    ...{
                        result: fullTimeResultAnimation,
                        active: isActiveLiveFullTime,
                        settlementResult,
                        gameName,
                        showSettlement,
                        progressBarStyle
                    },
                    ...buildHalfMatchProps(true),
                });
            } else {
                setHalfTimeResultAnimation(prev => {
                    prev.blue.push(halfTimeResult.blue[index]);
                    prev.red.push(halfTimeResult.red[index]);

                    return prev;
                });

                setResultProps({
                    ...{
                        result: halfTimeResultAnimation,
                        active: !isActiveLiveFullTime,
                        settlementResult,
                        gameName,
                        showSettlement,
                        progressBarStyle
                    },
                    ...buildHalfMatchProps(false),
                });
            }
            index++;
        }

        doAnimation();
        const timerId = setInterval(doAnimation, 200);

        return () => {
            clearInterval(timerId);
        };
    }, [halfTimeResult, fullTimeResult]);

    return <div className={Styles["popup-result"]}>{resultProps !== null && <HalfRoundResultPopup {...resultProps} />}</div>;
};

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
