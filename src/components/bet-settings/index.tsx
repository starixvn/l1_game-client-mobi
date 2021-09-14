import React, { useEffect, useRef, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { ChipLabelMapper, ChipMapper } from "../../common/constants";
import Styles from "./bet-setting.module.scss";
import { ChipSlider } from "./chip-slider";
import { QuickBetBtn } from "./quick-bet-btn";

type Props = {
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
    enabledSound: boolean;
    betValue: number;
};

const BetSettings: React.FC<Props> = ({ updateBetValue, enabledQuickBet, updateEnabledQuickBet, enabledSound, betValue }) => {
    const [isCollapse, setIsCollapse] = useState(true);
    const [isChangingMode, setIsChangingMode] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    let animationTimeOut: NodeJS.Timeout = null;

    const updateSliderCollapseHandle = (isCollapse: boolean) => {
        setIsChangingMode(true);

        animationTimeOut = setTimeout(() => {
            setIsCollapse(isCollapse);
            setIsChangingMode(false);
        }, 200);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isCollapse && isMobileOnly && wrapperRef?.current && !wrapperRef.current.contains(event.target)) {
                updateSliderCollapseHandle(true);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef, isCollapse]);

    useEffect(() => animationTimeOut && clearTimeout(animationTimeOut), []);

    return (
        <>
            {isCollapse && isMobileOnly ? (
                <div
                    className={`${Styles["slider-collapse"]} ${isChangingMode ? Styles["collapse-animation"] : Styles["expand-animation"]}`}
                    onClick={() => updateSliderCollapseHandle(false)}
                >
                    <div className={`${Styles["chip-container"]} ${Styles[ChipMapper[betValue]]}`}>
                        <img
                            src={`/static/images/chips/${ChipMapper[betValue]}.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="40"
                            height="42"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>{ChipLabelMapper[betValue]}</span>
                    </div>

                    {enabledQuickBet && (
                        <img
                            src={`/static/images/icon-quick-bet-active.svg?v=1625225065074`}
                            className={`img-fluid ${Styles["icon-enable-quickbet"]}`}
                            width="20"
                            height="20"
                            alt="Chip"
                        />
                    )}
                </div>
            ) : (
                <div
                    ref={wrapperRef}
                    className={`${Styles["bet-settings"]} ${isChangingMode ? Styles["collapse-animation"] : Styles["expand-animation"]}`}
                >
                    <div className={Styles["settings-container"]}>
                        <div className={`game-container ${Styles["container"]}`}>
                            <div className={Styles["wrapper-chips"]}>
                                {!isMobileOnly && (
                                    <QuickBetBtn
                                        enabledQuickBet={enabledQuickBet}
                                        updateEnabledQuickBet={updateEnabledQuickBet}
                                        isHeaderSetting={false}
                                    />
                                )}
                                <div className={Styles["chips-container"]}>
                                    <ChipSlider
                                        currentBetValue={betValue}
                                        updateBetValue={updateBetValue}
                                        enabledSound={enabledSound}
                                        enabledQuickBet={enabledQuickBet}
                                        updateSliderCollapseHandle={updateSliderCollapseHandle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default React.memo(BetSettings);
