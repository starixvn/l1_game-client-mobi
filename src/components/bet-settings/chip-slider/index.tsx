import React, { useEffect, useState } from "react";
import Slider from "react-slick";

import { ChipLabelMapper, ChipValues } from "../../../common/constants";
import Chip from "../../shared/chip";
import Styles from "./chip-slider.module.scss";

const SlidingTimeInMillisecond = 100;
let isSwipe = true;

export const ChipSlider: React.FC<{ betValue: number; updateBetValue: Function }> = ({ betValue, updateBetValue }) => {
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [isSliding, setIsSliding] = useState(false);
    let sliderRef = null;
    const [audio] = useState(new Audio("./static/sounds/chip-click.mp3"));

    const handleSelectChip = (chipValue: number) => {
        updateArrowsByChipValue(chipValue);
        updateBetValue(chipValue);
        audio.play();
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

    useEffect(() => {
        if (sliderRef) {
            updateArrowsByChipValue(betValue);
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
                    slidesToShow: 3,
                },
            },
        ],
    };

    return (
        <React.Fragment>
            <span className={`${Styles["icon-prev"]} ${!enabledPrevBtn && Styles["disabled"]}`} onClick={onClickPrev}></span>
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
            <span className={`${Styles["icon-next"]} ${!enabledNextBtn && Styles["disabled"]}`} onClick={onClickNext}></span>
        </React.Fragment>
    );
};
