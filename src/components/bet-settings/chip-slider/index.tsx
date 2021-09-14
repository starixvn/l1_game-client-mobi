import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import useSound from "use-sound";
import { ChipLabelMapper, ChipMapper, ChipValues } from "../../../common/constants";
import Styles from "./chip-slider.module.scss";

const SlidingTimeInMillisecond = 100;
let isSwipe = true;

export const ChipSlider: React.FC<{
    updateBetValue: Function;
    enabledSound: boolean;
    enabledQuickBet: boolean;
    currentBetValue: number;
    updateSliderCollapseHandle: Function;
}> = ({ updateBetValue, enabledSound, enabledQuickBet, currentBetValue, updateSliderCollapseHandle }) => {
    const [enabledPrevBtn, setEnabledPrevBtn] = useState(false);
    const [enabledNextBtn, setEnabledNextBtn] = useState(true);
    const [selectedChip, setSelectedChip] = useState(currentBetValue);
    const [isSliding, setIsSliding] = useState(false);
    const [playSound] = useSound("./static/sounds/chip-click.mp3");
    let sliderRef = null;

    const onClickChip = (chipValue: number) => {
        if (currentBetValue === chipValue) {
            updateSliderCollapseHandle(true);
        } else {
            const chipIndex = ChipValues.indexOf(chipValue);
            const currentSlideToShow = getCurrentSlidesToShow();
            const currentSlide = sliderRef.innerSlider.state.currentSlide;

            if (chipIndex + 1 - currentSlideToShow >= currentSlide) {
                disableSelectChipWhenSliding();
                isSwipe = false;
                sliderRef.slickGoTo(chipIndex + 2 - currentSlideToShow);
            }

            if (chipIndex - 1 <= currentSlide) {
                disableSelectChipWhenSliding();
                isSwipe = false;
                sliderRef.slickGoTo(chipIndex - 1);
            }

            handleSelectChip(chipValue);
        }
    };

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
            const chipIndex = ChipValues.indexOf(currentBetValue);
            isSwipe = false;
            sliderRef.slickGoTo(chipIndex - 2);

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
                className={`icon-arrow-left ${Styles["icon-prev"]} ${!enabledPrevBtn && Styles["disabled"]} ${
                    enabledQuickBet ? Styles["quick-bet"] : ""
                }`}
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
                        className={`${Styles["chip-container"]} ${selectedChip === value ? Styles["selected"] : ""} ${
                            enabledQuickBet ? Styles["enabled-quick-bet"] : ""
                        } ${Styles[ChipMapper[value]]}`}
                        onClick={() => onClickChip(value)}
                    >
                        <img
                            src={`/static/images/chips/${ChipMapper[value]}.svg`}
                            className={`img-fluid ${Styles["chip"]}`}
                            width="60"
                            height="62"
                            alt="Chip"
                        />
                        <span className={Styles["value"]}>{ChipLabelMapper[value]}</span>
                    </div>
                ))}
            </Slider>
            <span
                className={`icon-arrow-left ${Styles["icon-next"]} ${!enabledNextBtn && Styles["disabled"]} ${
                    enabledQuickBet ? Styles["quick-bet"] : ""
                }`}
                onClick={onClickNext}
            ></span>
        </React.Fragment>
    );
};
