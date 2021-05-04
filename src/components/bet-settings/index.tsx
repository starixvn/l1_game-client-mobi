import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import { localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import Chip from "../chip";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import ConfirmMessage from "../shared/confirm-message";
import Styles from "./bet-setting.module.scss";

type Props = {
    betValue: number;
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
};

const SlidingTimeInMillisecond = 350;

export const BetSettings: React.FC<Props> = ({ betValue, updateBetValue, enabledQuickBet, updateEnabledQuickBet }) => {
    const [isShowSettings, setShowSettings] = useState(true);
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [isShowModalConfirm, setIsShowPopup] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const [isSwipe, setIsSwipe] = useState(true);
    let sliderRef = null;
    const { t } = useTranslation("common");
    const chipClickSound = new Audio("./static/sounds/chip-click.mp3");

    const chipList = { "1": 1, "5": 5, "10": 10, "50": 50, "100": 100, "200": 200, "500": 500, "1k": 1000, "2k": 2000, "3k": 3000 };
    const chipColorMapper = {
        "1": "chip-1",
        "5": "chip-2",
        "10": "chip-3",
        "50": "chip-5",
        "100": "chip-6",
        "200": "chip-7",
        "500": "chip-8",
        "1000": "chip-9",
        "2000": "chip-10",
        "3000": "chip-11",
    };
    const chipValues = Object.values(chipList);

    const SliderSetting = {
        speed: SlidingTimeInMillisecond,
        infinite: false,
        adaptiveHeight: true,
        swipeToSlide: true,
        slidesToShow: 10,
        arrows: false,
        onSwipe: () => setIsSwipe(true),
        beforeChange: (oldIndex: number, newIndex: number) => {
            if (isSwipe) {
                oldIndex > newIndex && handleSelectChip(chipValues[newIndex + 2]);
                oldIndex < newIndex && handleSelectChip(chipValues[newIndex]);
            }
        },
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
        if (sliderRef) {
            updateArrowsByChipValue(betValue);
        }
    }, [isShowSettings]);

    const HandleClickActiveBtn = () => {
        setShowSettings(!isShowSettings);
    };

    const onClickNext = () => {
        if (enabledNextBtn && !isSliding) {
            const chipIndex = chipValues.indexOf(betValue);
            const newSelectedChip = chipValues[chipIndex + 1];

            sliderRef.slickGoTo(chipIndex + 1);
            handleSelectChip(newSelectedChip);
            setIsSwipe(false);
            disableSelectChipWhenSliding();
        }
    };

    const onClickPrev = () => {
        if (enabledPrevBtn && !isSliding) {
            const chipIndex = chipValues.indexOf(betValue);
            const newSelectedChip = chipValues[chipIndex - 1];

            sliderRef.slickGoTo(chipIndex - 2);
            handleSelectChip(newSelectedChip);
            setIsSwipe(false);
            disableSelectChipWhenSliding();
        }
    };

    const onClickQuickBet = () => {
        if (!enabledQuickBet) {
            setIsShowPopup(true);
        } else {
            handleDataQuickBet();
        }
    };

    const disableSelectChipWhenSliding = () => {
        setIsSliding(true);

        const slidingTimeOut = setTimeout(() => {
            setIsSliding(false);
            clearTimeout(slidingTimeOut);
        }, SlidingTimeInMillisecond);
    };

    const handleDataQuickBet = () => {
        storeLocalStorageItem(localStorageKeys.enabledQuickBet, !enabledQuickBet);
        updateEnabledQuickBet(!enabledQuickBet);
    };

    const confirmQuickBet = () => {
        handleDataQuickBet();
        closeModal();
        updateEnabledQuickBet(true);
    };

    const handleSelectChip = (chipValue: number) => {
        chipClickSound.play();
        updateArrowsByChipValue(chipValue);
        updateBetValue(chipValue);
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
        <div className={Styles["bet-settings"]}>
            {!isShowSettings && (
                <div
                    className={`${Styles["betting-setting-collapsed"]} ${enabledQuickBet && Styles["quick-bet"]}`}
                    onClick={HandleClickActiveBtn}
                >
                    <span className={`icon-arrow2-right ${Styles["expand-icon"]}`}></span>
                    <div className={`${Styles.chip} ${Styles[chipColorMapper[betValue]]}`}>
                        <div className={Styles["layer1"]}></div>
                        <div className={Styles["layer2"]}></div>
                        <div className={Styles["group-list"]}>
                            <span className={`icon-chip-symbol ${Styles["symbol1"]}`}></span>
                            <span className={`icon-chip-symbol ${Styles["symbol2"]}`}></span>
                            <span className={`icon-chip-symbol ${Styles["symbol3"]}`}></span>
                            <span className={`icon-chip-symbol ${Styles["symbol4"]}`}></span>
                        </div>
                        <div className={Styles["number"]}>{getChipDisplayByValue(betValue)}</div>
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
                            <Slider
                                ref={(c) => {
                                    sliderRef = c;
                                }}
                                {...SliderSetting}
                            >
                                {Object.keys(chipList).map((key) => (
                                    <Chip
                                        key={key}
                                        display={key}
                                        value={chipList[key]}
                                        onSelected={handleSelectChip}
                                        selected={betValue === chipList[key]}
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

            {isShowSettings && isShowModalConfirm && enabledQuickBet === false && (
                <div className={Styles["modalConfirm"]}>
                    <div className={Styles["bg-opacity"]}></div>
                    <BaseDialog type={ModalType.Message} isOpen={isShowModalConfirm} onCloseModal={closeModal}>
                        <ConfirmMessage
                            t={t}
                            message={t("messageConfirmQuickBet")}
                            closeModal={closeModal}
                            confirmQuickBet={confirmQuickBet}
                        />
                    </BaseDialog>
                </div>
            )}
        </div>
    );
};
