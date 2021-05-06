import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { ChipLabelMapper, ChipValues } from "../../common/constants";

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

const SlidingTimeInMillisecond = 250;

export const BetSettings: React.FC<Props> = ({ betValue, updateBetValue, enabledQuickBet, updateEnabledQuickBet }) => {
    const [isShowSettings, setShowSettings] = useState(true);
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [isShowModalConfirm, setIsShowPopup] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const [isSwipe, setIsSwipe] = useState(true);
    const { t } = useTranslation("common");
    const chipClickSound = new Audio("./static/sounds/chip-click.mp3");
    const SliderSetting = {
        speed: SlidingTimeInMillisecond,
        infinite: false,
        adaptiveHeight: true,
        swipeToSlide: true,
        slidesToShow: 10,
        focusOnSelect: true,
        arrows: false,
        onSwipe: () => setIsSwipe(true),
        beforeChange: (oldIndex: number, newIndex: number) => {
            if (isSwipe) {
                oldIndex > newIndex && handleSelectChip(ChipValues[newIndex + 2]);
                oldIndex < newIndex && handleSelectChip(ChipValues[newIndex]);
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

    let sliderRef = null;

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
            const chipIndex = ChipValues.indexOf(betValue);
            const newSelectedChip = ChipValues[chipIndex + 1];

            sliderRef.slickGoTo(chipIndex + 1);
            handleSelectChip(newSelectedChip);
            setIsSwipe(false);
            disableSelectChipWhenSliding();
        }
    };

    const onClickPrev = () => {
        if (enabledPrevBtn && !isSliding) {
            const chipIndex = ChipValues.indexOf(betValue);
            const newSelectedChip = ChipValues[chipIndex - 1];

            sliderRef.slickGoTo(chipIndex - 1);
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
        const chipIndex = ChipValues.indexOf(chipValue);

        chipIndex === 0 ? setEnabledPrevBtn(false) : setEnabledPrevBtn(true);
        chipIndex === ChipValues.length - 1 ? setEnabledNextBtn(false) : setEnabledNextBtn(true);
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
                    <span className={Styles["expand-icon"]}></span>
                    <Chip value={betValue} />
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
                                className={`${Styles["icon-prev"]} ${!enabledPrevBtn && Styles["disabled"]}`}
                                onClick={onClickPrev}
                            ></span>
                            <Slider
                                ref={(c) => {
                                    sliderRef = c;
                                }}
                                {...SliderSetting}
                            >
                                {Object.keys(ChipLabelMapper).map((key) => (
                                    <Chip
                                        key={key}
                                        value={ChipLabelMapper[key]}
                                        onSelected={handleSelectChip}
                                        selected={betValue === ChipLabelMapper[key]}
                                    />
                                ))}
                            </Slider>
                            <span
                                className={`${Styles["icon-next"]} ${!enabledNextBtn && Styles["disabled"]}`}
                                onClick={onClickNext}
                            ></span>
                        </div>

                        <div className={Styles["collapse-settings"]} onClick={HandleClickActiveBtn}>
                            <span className={`${Styles["collapse-icon"]}`}></span>
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
