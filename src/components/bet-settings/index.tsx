import { useTranslation } from "next-i18next";
import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { AudioCollection } from "../../common/audio";

import { ChipLabelMapper, ChipValues } from "../../common/constants";
import Chip from "../chip";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import ConfirmMessage from "./confirm-message";
import Styles from "./bet-setting.module.scss";
import { useAuthContext } from "../../contexts/auth";
import { UserClientCommunication } from "../../services";

type Props = {
    betValue: number;
    updateBetValue: (betValue: number) => void;
    enabledQuickBet: boolean;
    updateEnabledQuickBet: (value: boolean) => void;
};

const SlidingTimeInMillisecond = 250;
let selectChipSound: HTMLAudioElement = null;
let isSwipe = true;

export const BetSettings: React.FC<Props> = ({ betValue, updateBetValue, enabledQuickBet, updateEnabledQuickBet }) => {
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [isShowModalConfirm, setIsShowPopup] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const [isShowTooltip, setIsShowTooltip] = useState(true);
    const authContext = useAuthContext();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const userSettingsService = UserClientCommunication.getUserClientInstance().userSettings;

    const { t } = useTranslation("common");

    const SliderSetting = {
        speed: SlidingTimeInMillisecond,
        infinite: false,
        adaptiveHeight: true,
        swipeToSlide: true,
        slidesToShow: 10,
        arrows: false,
        onSwipe: () => {
            isSwipe = true;
        },
        beforeChange: (oldIndex: number, newIndex: number) => {
            if (isSwipe) {
                const currentSlideToShow = getCurrentSlidesToShow();

                oldIndex > newIndex && handleSelectChip(ChipValues[newIndex + currentSlideToShow - 1]);
                oldIndex < newIndex && handleSelectChip(ChipValues[newIndex]);
            }
        },
        responsive: [
            {
                breakpoint: 1279,
                settings: {
                    slidesToShow: 8,
                },
            },
            {
                breakpoint: 1023,
                settings: {
                    slidesToShow: 6,
                },
            },
            {
                breakpoint: 767,
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
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (isShowTooltip && tooltipRef && tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsShowTooltip(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [tooltipRef]);

    const onClickNext = () => {
        if (enabledNextBtn && !isSliding) {
            const chipIndex = ChipValues.indexOf(betValue);
            const newSelectedChip = ChipValues[chipIndex + 1];
            const currentSlideToShow = getCurrentSlidesToShow();

            isSwipe = false;
            sliderRef.slickGoTo(chipIndex + 3 - currentSlideToShow);
            handleSelectChip(newSelectedChip);
            disableSelectChipWhenSliding();
        }
    };

    const onClickPrev = () => {
        if (enabledPrevBtn && !isSliding) {
            const chipIndex = ChipValues.indexOf(betValue);
            const newSelectedChip = ChipValues[chipIndex - 1];

            isSwipe = false;
            sliderRef.slickGoTo(chipIndex - 2);
            handleSelectChip(newSelectedChip);
            disableSelectChipWhenSliding();
        }
    };

    const onClickQuickBet = () => {
        if (!enabledQuickBet) {
            setIsShowPopup(true);
        } else {
            updateEnabledQuickBet(false);
            userSettingsService.updateUserQuickBetSetting(authContext.session.ss, authContext.session.username, false);
        }
    };

    const getCurrentSlidesToShow = () => {
        const currentBreakPoint = sliderRef.state.breakpoint;
        const sliderResponsiveSettings = sliderRef.props.responsive;
        const currentResponsiveSettings = sliderResponsiveSettings.find((settings) => settings.breakpoint === currentBreakPoint);

        return currentResponsiveSettings?.settings?.slidesToShow ?? sliderRef.props.slidesToShow;
    };

    const disableSelectChipWhenSliding = () => {
        setIsSliding(true);

        const slidingTimeOut = setTimeout(() => {
            setIsSliding(false);
            clearTimeout(slidingTimeOut);
        }, SlidingTimeInMillisecond);
    };

    const confirmQuickBet = () => {
        setIsShowTooltip(false);
        closeModal();
        updateEnabledQuickBet(true);
        userSettingsService.updateUserQuickBetSetting(authContext.session.ss, authContext.session.username, true);
    };

    const handleSelectChip = (chipValue: number) => {
        selectChipSound = AudioCollection.getSelectChipSound();
        selectChipSound.play();

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

    const closeHintTooltip = () => {
        setIsShowTooltip(false);
        userSettingsService.updateUserQuickBetSetting(authContext.session.ss, authContext.session.username, false);
    };

    const handleTurnOn = () => {
        setIsShowTooltip(false);
        confirmQuickBet();
    };

    return (
        <div className={Styles["bet-settings"]}>
            <div className={Styles["settings-container"]}>
                <div className={`game-container ${Styles["container"]}`}>
                    <div className={Styles["wrapper-chips"]}>
                        <div className={`${Styles["toggle"]}`}>
                            <div className={enabledQuickBet ? "heart-beat-animation" : ""}>
                                {!enabledQuickBet && <div className={Styles["ripple-animation"]}></div>}
                                <input
                                    className={Styles["toggle-checkbox"]}
                                    id="toggle-quickbet"
                                    type={"checkbox"}
                                    value={"Quick Bet"}
                                    checked={!!enabledQuickBet}
                                    onChange={onClickQuickBet}
                                />
                                <label className={Styles["toggle-btn"]} htmlFor="toggle-quickbet">
                                    <div className={Styles.chip}>
                                        <div className={Styles["layer1"]}></div>
                                        <div className={Styles["layer2"]}></div>
                                        <div className={Styles["group-list"]}>
                                            <span className={`icon-chip-symbol ${Styles["symbol1"]}`}></span>
                                            <span className={`icon-chip-symbol ${Styles["symbol2"]}`}></span>
                                            <span className={`icon-chip-symbol ${Styles["symbol3"]}`}></span>
                                            <span className={`icon-chip-symbol ${Styles["symbol4"]}`}></span>
                                        </div>
                                        <div className={Styles["icon-quick-bet"]}></div>
                                    </div>
                                </label>
                                <div className={Styles["one-click-bet"]}>1-Click Bet</div>
                            </div>
                            {enabledQuickBet === undefined && isShowTooltip && (
                                <div ref={tooltipRef} className={`popover-custom top ${Styles["hint-one-click-bet"]}`}>
                                    <div
                                        className={Styles.content}
                                        dangerouslySetInnerHTML={{
                                            __html: t("common:oneClickHintMsg").replace("{0}", `<strong>1-Click Bet</strong>`),
                                        }}
                                    ></div>
                                    <div className={Styles.action}>
                                        <button className={`btn-grey ${Styles["btn"]}`} onClick={() => closeHintTooltip()}>
                                            {t("common:dismiss")}
                                        </button>
                                        <button className={`btn-orange ${Styles["btn"]}`} onClick={() => handleTurnOn()}>
                                            {t("common:turnOn")}
                                        </button>
                                    </div>
                                </div>
                            )}
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
                    </div>
                </div>
            </div>

            {isShowModalConfirm && !!enabledQuickBet === false && (
                <div className={Styles["modalConfirm"]}>
                    <div className={Styles["bg-opacity"]}></div>
                    <BaseDialog type={ModalType.Message} isOpen={isShowModalConfirm} onCloseModal={closeModal}>
                        <ConfirmMessage closeModal={closeModal} confirmQuickBet={confirmQuickBet} />
                    </BaseDialog>
                </div>
            )}
        </div>
    );
};
