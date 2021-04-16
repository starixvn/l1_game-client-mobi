import React, { useEffect, useRef, useState } from "react";

import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import Chip from "../chip";
import Styles from "./bet-setting.module.scss";
import { BetSettingStorageType } from "./type";
import BaseDialog from "../shared/base-dialog";
import ConfirmMessage from "../shared/confirm-message";
import { ModalType } from "../shared/base-dialog/type";
import Slider from "react-slick";
import { useTranslation } from "next-i18next";

export const BetSettings: React.FC = () => {
    const [isShowSettings, setShowSettings] = useState(true);
    const [selectedChipValue, setSelectedChipValue] = useState(1);
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [enabledQuickBet, setEnabledQuickBet] = useState(false);
    const [isShowModalConfirm, setIsShowPopup] = useState(false);
    const betSettingStorageKey = localStorageKeys.betSetting;
    let sliderRef = null;
    const { t } = useTranslation("common");

    const SliderSetting = {
        speed: 500,
        infinite: false,
        adaptiveHeight: true,
        swipeToSlide: true,
        slidesToShow: 9,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                },
            },
        ],
    };

    useEffect(() => {
        const betSettings = getLocalStorageItem<BetSettingStorageType>(betSettingStorageKey);

        if (betSettings) {
            setEnabledQuickBet(betSettings.enabledQuickBet);
            setSelectedChipValue(betSettings.betValue);
            updateArrowsByChipValue(betSettings.betValue);
        }
    }, []);

    const HandleClickActiveBtn = () => {
        setShowSettings(!isShowSettings);
    };

    const chipList = { "1": 1, "5": 5, "10": 10, "50": 50, "100": 100, "200": 200, "500": 500, "1k": 1000, "2k": 2000 };
    const chipColorMapper = Object.values(chipList).reduce((result, chip, index) => {
        result[chip] = `chip-${index + 1}`;

        return result;
    }, {});
    const chipValues = Object.values(chipList);

    const onClickNext = () => {
        if (enabledNextBtn) {
            sliderRef.current.slickNext();
            const chipIndex = chipValues.indexOf(selectedChipValue);
            const newSelectedChip = chipValues[chipIndex + 1];

            handleSelectChip(newSelectedChip);
        }
    };

    const onClickPrev = () => {
        if (enabledPrevBtn) {
            sliderRef.current.slickPrev();
            const chipIndex = chipValues.indexOf(selectedChipValue);
            const newSelectedChip = chipValues[chipIndex - 1];

            handleSelectChip(newSelectedChip);
        }
    };

    const onClickQuickBet = () => {
        if (!enabledQuickBet) {
            setIsShowPopup(true);
        } else {
            setEnabledQuickBet(!enabledQuickBet);
        }
    };

    const handleDataQuickBet = () => {
        const betSettingStorage: BetSettingStorageType = {
            betValue: selectedChipValue,
            enabledQuickBet: !enabledQuickBet,
        };

        storeLocalStorageItem(betSettingStorageKey, betSettingStorage);
        setEnabledQuickBet(!enabledQuickBet);
        closeModal();
        setEnabledQuickBet(true);
    };

    const handleSelectChip = (chipValue: number) => {
        const betSettingStorage: BetSettingStorageType = {
            betValue: chipValue,
            enabledQuickBet: enabledQuickBet,
        };

        updateArrowsByChipValue(chipValue);
        storeLocalStorageItem(betSettingStorageKey, betSettingStorage);
        setSelectedChipValue(chipValue);
    };

    const updateArrowsByChipValue = (chipValue: number) => {
        const chipIndex = chipValues.indexOf(chipValue);

        chipIndex === 0 ? setEnabledPrevBtn(false) : setEnabledPrevBtn(true);
        chipIndex === chipValues.length - 1 ? setEnabledNextBtn(false) : setEnabledNextBtn(true);
    };

    const getChipDisplayByValue = (value: number) => {
        return Object.keys(chipList).find((key) => chipList[key] === value);
    };

    const closeModal = () => {
        setIsShowPopup(false);
    };

    return (
        <div>
            {!isShowSettings && (
                <div
                    className={`${Styles["betting-setting-collapsed"]} ${enabledQuickBet && Styles["quick-bet"]}`}
                    onClick={HandleClickActiveBtn}
                >
                    <span className={`icon-arrow2-right ${Styles["expand-icon"]}`}></span>
                    <div className={`${Styles.chip} ${Styles[chipColorMapper[selectedChipValue]]}`}>
                        <div className={Styles["layer1"]}></div>
                        <div className={Styles["layer2"]}></div>
                        <div className={Styles["group-list"]}>
                            <span className={`icon-chip-symbol ${Styles["symbol1"]}`}></span>
                            <span className={`icon-chip-symbol ${Styles["symbol2"]}`}></span>
                            <span className={`icon-chip-symbol ${Styles["symbol3"]}`}></span>
                            <span className={`icon-chip-symbol ${Styles["symbol4"]}`}></span>
                        </div>
                        <div className={Styles["number"]}>{getChipDisplayByValue(selectedChipValue)}</div>
                    </div>
                    {enabledQuickBet && (
                        <div className={Styles["quick-bet-mark-container"]}>
                            <span className={`icon-quick-bet ${Styles["quick-bet-mark"]}`}></span>{" "}
                        </div>
                    )}
                </div>
            )}

            {isShowSettings && (
                <div className={Styles["settings-container"]}>
                    <div className={`game-container ${Styles["container"]}`}>
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
                            <Slider ref={sliderRef} {...SliderSetting}>
                                {Object.keys(chipList).map((key) => (
                                    <Chip
                                        key={key}
                                        display={key}
                                        value={chipList[key]}
                                        onSelected={handleSelectChip}
                                        selected={selectedChipValue === chipList[key]}
                                        color={chipColorMapper[chipList[key]]}
                                    />
                                ))}
                            </Slider>
                            <span
                                className={`icon-arrow-right ${Styles["next"]} ${!enabledNextBtn && Styles["disabled"]}`}
                                onClick={onClickNext}
                            ></span>
                        </div>

                        <div className={Styles["collapse-settings"]} onClick={HandleClickActiveBtn}>
                            <span className={`icon-arrow2-right ${Styles["collapse-btn"]}`}></span>
                        </div>
                    </div>
                </div>
            )}

            {isShowSettings && isShowModalConfirm && !enabledQuickBet && (
                <div className={Styles["modalConfirm"]}>
                    <BaseDialog type={ModalType.Center} isOpen={isShowModalConfirm} onCloseModal={closeModal}>
                        <ConfirmMessage
                            t={t}
                            message={t("messageConfirmQuickBet")}
                            closeModal={closeModal}
                            confirmQuickBet={handleDataQuickBet}
                        />
                    </BaseDialog>
                </div>
            )}
            <div id="blue"></div>
        </div>
    );
};
