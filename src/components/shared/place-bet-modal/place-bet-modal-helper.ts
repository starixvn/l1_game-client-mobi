interface BetFormPositionCss {
    top: string;
    bottom?: string;
    right?: string;
    left?: string;
}

interface BetFormCss {
    position: BetFormPositionCss;
    arrowStyle: string;
    alignArrowStyle: string;
    arrowStyleLeft?: string;
}

interface AdjustedBetFormCss {
    styles?: BetFormCss;
    isAdjust: boolean;
}

export const adjustPopupPosition = (
    gameBaseContainerRef: any,
    betOptionElement: HTMLElement,
    betChoiceElement: HTMLElement
): BetFormCss => {
    const betContainerRect = gameBaseContainerRef.current.parentElement.getBoundingClientRect(),
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
        betChoiceRect = betChoiceElement.getBoundingClientRect(),
        betOptionRect = betOptionElement.getBoundingClientRect(),
        rightGap = Math.round(betChoiceRect.right - betContainerRect.right),
        isAlignRight = rightGap > -5 && rightGap < 5,
        leftGap = Math.round(betContainerRect.left - betChoiceRect.left),
        isAlignLeft = leftGap > -5 && leftGap < 5;

    const gameContainerMarginLeft = 6,
        popupPadding = 16,
        arrowPadding = 64,
        halfArrowWidth = 8;

    let alignArrowStyle = "left";
    let popupStyle: BetFormPositionCss = {
        top: `${betOptionRect.bottom - gameContainerRect.top}px`,
        bottom: "none",
        left: `${betChoiceRect.width / 2 - arrowPadding + gameContainerMarginLeft + popupPadding + halfArrowWidth}px`,
        right: "none",
    };

    if (isAlignRight) {
        popupStyle.right = `${betChoiceRect.width / 2 - arrowPadding + popupPadding + halfArrowWidth}px`;
        popupStyle.left = "none";
        alignArrowStyle = "right";
    }

    const quarterPopupWidth = 100,
        extendLeft = quarterPopupWidth + gameContainerMarginLeft + popupPadding + halfArrowWidth;

    if (!isAlignRight && !isAlignLeft) {
        popupStyle.right = "none";
        popupStyle.left = `${
            gameContainerRect.width - (gameContainerRect.right - betChoiceRect.left) + betChoiceRect.width / 2 - extendLeft
        }px`;
        alignArrowStyle = "center";
    }

    if (isAlignRight && isAlignLeft) {
        popupStyle.right = "none";
        popupStyle.left = `${gameContainerRect.width / 2 - extendLeft}px`;
        alignArrowStyle = "center";
    }

    return {
        position: popupStyle,
        arrowStyle: "up",
        alignArrowStyle,
    };
};

export const adjustPopupPositionDidUpdate = (
    gameBaseContainerRef: any,
    wrapperRef: any,
    betOptionElement: HTMLElement,
    betChoiceElement: HTMLElement
): AdjustedBetFormCss => {
    const popupRef = wrapperRef.current,
        betOptionRect = betOptionElement.getBoundingClientRect();

    let adjustedBetFormCss: AdjustedBetFormCss = {
        isAdjust: false,
        styles: null,
    };

    const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();

    const betSettingHeight = 86;
    if (window.innerHeight - betOptionRect.bottom < betSettingHeight + popupRef.getBoundingClientRect().height) {
        let styles = adjustPopupPosition(gameBaseContainerRef, betOptionElement, betChoiceElement);
        styles.position.bottom = `${gameContainerRect.bottom - betOptionRect.top}px`;
        styles.position.top = "none";
        styles.arrowStyle = "down";

        adjustedBetFormCss = {
            isAdjust: true,
            styles,
        };
    }

    return adjustedBetFormCss;
};


export const adjustPopupPositionMobile = (betOptionElement: HTMLElement): BetFormCss => {
    const betOptionRect = betOptionElement.getBoundingClientRect();

    return {
        position: {
            top: `${betOptionRect.bottom}px`,
        },
        arrowStyle: "up",
        alignArrowStyle: "left",
        arrowStyleLeft: `${betOptionRect.left + betOptionRect.width / 2}px`,
    };
};


export const adjustPopupPositionDidUpdateMobile = (wrapperRef: any, betOptionElement: HTMLElement): AdjustedBetFormCss => {
    const popupRef = wrapperRef.current,
        betOptionRect = betOptionElement.getBoundingClientRect();

    const betSettingHeight = 128;
    if (window.innerHeight - betOptionRect.bottom < betSettingHeight + popupRef.getBoundingClientRect().height) {
        let styles = adjustPopupPositionMobile(betOptionElement);
        styles.position.top = `${betOptionRect.bottom - popupRef.getBoundingClientRect().height - betOptionRect.height}px`;
        styles.arrowStyle = "down";

        return {
            isAdjust: true,
            styles,
        };
    }

    return {
        isAdjust: false,
    };
};
