import React, { useEffect, useState } from "react";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";

import Chip from "../chip";
import Styles from "./bet-setting.module.scss";
import { BetSettingStorageType } from "./type";

export const BetSettings: React.FC = () => {
    const [isShowSettings, setShowSettings] = useState(false);
    const [selectedChipValue, setSelectedChipValue] = useState(1);
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [enabledQuickBet, setEnabledQuickBet] = useState(false);
    const betSettingStorageKey = localStorageKeys.betSetting;

    useEffect(() => {
        const betSettings = getLocalStorageItem<BetSettingStorageType>(betSettingStorageKey);

        if (betSettings) {
            setEnabledQuickBet(betSettings.enabledQuickBet);
            setSelectedChipValue(betSettings.betValue);
        }
    }, []);

    const HandleClickActiveBtn = () => {
        setShowSettings(!isShowSettings);
    };

    const chipList = { "1": 1, "5": 5, "10": 10, "50": 50, "100": 100, "200": 200, "500": 500, "1k": 1000, "2k": 2000 };
    const chipValues = Object.values(chipList);

    const onClickNext = () => {
        if (enabledNextBtn) {
            const chipIndex = chipValues.indexOf(selectedChipValue);
            const newSelectedChip = chipValues[chipIndex + 1];

            handleSelectChip(newSelectedChip);
        }
    };

    const onClickPrev = () => {
        if (enabledPrevBtn) {
            const chipIndex = chipValues.indexOf(selectedChipValue);
            const newSelectedChip = chipValues[chipIndex - 1];

            handleSelectChip(newSelectedChip);
        }
    };

    const onClickQuickBet = () => {
        const betSettingStorage: BetSettingStorageType = {
            betValue: selectedChipValue,
            enabledQuickBet: !enabledQuickBet,
        };

        storeLocalStorageItem(betSettingStorageKey, betSettingStorage);
        setEnabledQuickBet(!enabledQuickBet);
    };

    const handleSelectChip = (chipValue: number) => {
        const chipIndex = chipValues.indexOf(chipValue);

        chipIndex === 0 ? setEnabledPrevBtn(false) : setEnabledPrevBtn(true);
        chipIndex === chipValues.length - 1 ? setEnabledNextBtn(false) : setEnabledNextBtn(true);
        const betSettingStorage: BetSettingStorageType = {
            betValue: chipValue,
            enabledQuickBet: enabledQuickBet,
        };

        storeLocalStorageItem(betSettingStorageKey, betSettingStorage);
        setSelectedChipValue(chipValue);
    };

    const getChipDisplayByValue = (value: number) => {
        return Object.keys(chipList).find((key) => chipList[key] === value);
    };

    return (
        <div>
            {!isShowSettings && (
                <div className={Styles["betting-setting-collapsed"]} onClick={HandleClickActiveBtn}>
                    <span className={`icon-arrow2-right ${Styles["expand-icon"]}`}></span>
                    <img src="/static/images/chip-reset.png" alt="chip" className="img-fluid" />
                    {enabledQuickBet && (
                        <div className={Styles["quick-bet-mark-container"]}>
                            <span className={`icon-quick-bet ${Styles["quick-bet-mark"]}`}></span>{" "}
                        </div>
                    )}
                </div>
            )}

            {isShowSettings && (
                <div className={Styles["settings-container"]}>
                    <div className={Styles["toggle"]}>
                        <input
                            className={Styles["toggle-checkbox"]}
                            id="toggle-quickbet"
                            type={"checkbox"}
                            value={"Quick Bet"}
                            checked={enabledQuickBet}
                            onChange={onClickQuickBet}
                        />
                        <label className={Styles["toggle-btn"]} htmlFor="toggle-quickbet">
                            <span className={`icon-quick-bet ${Styles["toggle-feature"]}`}></span>
                        </label>
                    </div>

                    <div className={Styles["chips-container"]}>
                        <span
                            className={`icon-arrow-right ${Styles["prev"]} ${!enabledPrevBtn && Styles["disabled"]}`}
                            onClick={onClickPrev}
                        ></span>
                        {Object.keys(chipList).map((key) => (
                            <Chip
                                key={key}
                                display={key}
                                value={chipList[key]}
                                onSelected={handleSelectChip}
                                selected={selectedChipValue === chipList[key]}
                            />
                        ))}
                        <span
                            className={`icon-arrow-right ${Styles["next"]} ${!enabledNextBtn && Styles["disabled"]}`}
                            onClick={onClickNext}
                        ></span>
                    </div>

                    <div className={Styles["collapse-settings"]}>
                        <span className={`icon-arrow2-right ${Styles["collapse-btn"]}`} onClick={HandleClickActiveBtn}></span>
                    </div>
                </div>
            )}
        </div>
    );
};
