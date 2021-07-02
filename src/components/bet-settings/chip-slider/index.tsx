import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import useSound from "use-sound";
import { ChipLabelMapper, ChipMapper, ChipValues } from "../../../common/constants";
import Chip from "../../shared/chip";
import Styles from "./chip-slider.module.scss";

const SlidingTimeInMillisecond = 100;
let isSwipe = true;

export const ChipSlider: React.FC<{ updateBetValue: Function; enabledSound: boolean; enabledQuickBet: boolean }> = ({
    updateBetValue,
    enabledSound,
    enabledQuickBet,
}) => {
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [selectedChip, setSelectedChip] = useState(1);
    const [isSliding, setIsSliding] = useState(false);
    let sliderRef = null;
    const [playSound] = useSound("./static/sounds/chip-click.mp3");

    const handleSelectChip = (chipValue: number) => {
        setSelectedChip(chipValue);
        updateArrowsByChipValue(chipValue);
        updateBetValue(chipValue);
        enabledSound && playSound();
    };

    const getCurrentSlidesToShow = () => {
        const currentBreakPoint = sliderRef.state.breakpoint;
        const sliderResponsiveSettings = sliderRef.props.responsive;
        const currentResponsiveSettings = sliderResponsiveSettings.find((settings) => settings.breakpoint === currentBreakPoint);

        return currentResponsiveSettings?.settings?.slidesToShow ?? sliderRef.props.slidesToShow;
    };

    const updateArrowsByChipValue = (chipValue: number) => {
        const chipIndex = ChipValues.indexOf(chipValue);

        chipIndex === 0 ? setEnabledPrevBtn(false) : setEnabledPrevBtn(true);
        chipIndex === ChipValues.length - 1 ? setEnabledNextBtn(false) : setEnabledNextBtn(true);
    };

    const disableSelectChipWhenSliding = () => {
        setIsSliding(true);

        const slidingTimeOut = setTimeout(() => {
            setIsSliding(false);
            clearTimeout(slidingTimeOut);
        }, SlidingTimeInMillisecond);
    };

    const onClickNext = () => {
        if (enabledNextBtn && !isSliding) {
            const chipIndex = ChipValues.indexOf(selectedChip);
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
            const chipIndex = ChipValues.indexOf(selectedChip);
            const newSelectedChip = ChipValues[chipIndex - 1];

            isSwipe = false;
            sliderRef.slickGoTo(chipIndex - 2);
            handleSelectChip(newSelectedChip);
            disableSelectChipWhenSliding();
        }
    };

    useEffect(() => {
        if (sliderRef) {
            updateArrowsByChipValue(selectedChip);
        }
    }, []);

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
                    slidesToShow: 5,
                },
            },
        ],
    };

    return (
        <React.Fragment>
            <span
                className={`${Styles["icon-prev"]} ${!enabledPrevBtn && Styles["disabled"]} ${enabledQuickBet ? Styles["quick-bet"] : ""}`}
                onClick={onClickPrev}
            ></span>
            <Slider
                ref={(c) => {
                    sliderRef = c;
                }}
                {...SliderSetting}
            >
                {ChipValues.map((value) => (
                    <div
                        key={value}
                        className={`${Styles["chip"]} ${selectedChip === value ? Styles["selected"] : ""}`}
                        onClick={() => handleSelectChip(value)}
                    >
                        <img src={`/static/images/chips/${ChipMapper[value]}.svg`} className={Styles["chip"]} alt="dice" />
                        <span className={Styles["chip-value"]}>{value}</span>
                    </div>
                ))}
            </Slider>
            <span
                className={`${Styles["icon-next"]} ${!enabledNextBtn && Styles["disabled"]} ${enabledQuickBet ? Styles["quick-bet"] : ""}`}
                onClick={onClickNext}
            ></span>
        </React.Fragment>
    );
};
