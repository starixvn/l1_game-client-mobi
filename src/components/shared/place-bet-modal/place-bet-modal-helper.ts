interface BetFormPositionCss {
    top: string;
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

export const adjustPopupPosition = (gameBaseContainerRef: any, betOptionElement: HTMLElement): BetFormCss => {
    const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
        betOptionRect = betOptionElement.getBoundingClientRect();

    return {
        position: {
            top: `${betOptionRect.bottom - gameContainerRect.top}px`,
        },
        arrowStyle: "up",
        alignArrowStyle: "left",
    };
};

export const adjustPopupPositionDidUpdate = (
    gameBaseContainerRef: any,
    wrapperRef: any,
    betOptionElement: HTMLElement,
    betChoiceElement: HTMLElement
): AdjustedBetFormCss => {
    let styles = adjustPopupPosition(gameBaseContainerRef, betOptionElement);
    const popupRef = wrapperRef.current;

    const gameContainerMarginLeft = 6,
        popupPadding = 16,
        arrowPadding = 64,
        halfArrowWidth = 8,
        gapWidthInSafari = 5;

    const betContainerRect = gameBaseContainerRef.current.parentElement.getBoundingClientRect(),
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
        betChoiceRect = betChoiceElement.getBoundingClientRect(),
        betOptionRect = betOptionElement.getBoundingClientRect(),
        rightGap = Math.round(betChoiceRect.right - betContainerRect.right),
        isAlignRight = rightGap > gapWidthInSafari && rightGap < gapWidthInSafari,
        leftGap = Math.round(betContainerRect.left - betChoiceRect.left),
        isAlignLeft = leftGap > gapWidthInSafari && leftGap < gapWidthInSafari;

    styles.position.left = `${betChoiceRect.width / 2 - arrowPadding + gameContainerMarginLeft + popupPadding + halfArrowWidth}px`;
    styles.position.right = "none";

    if (isAlignRight) {
        styles.position.right = `${betChoiceRect.width / 2 - arrowPadding + popupPadding + halfArrowWidth}px`;
        styles.position.left = "none";
        styles.alignArrowStyle = "right";
    }

    const quarterPopupWidth = popupRef.getBoundingClientRect().width / 4,
        extendLeft = quarterPopupWidth + gameContainerMarginLeft + popupPadding + halfArrowWidth;

    if (!isAlignRight && !isAlignLeft) {
        styles.position.right = "none";
        styles.position.left = `${
            gameContainerRect.width - (gameContainerRect.right - betChoiceRect.left) + betChoiceRect.width / 2 - extendLeft
        }px`;
        styles.alignArrowStyle = "center";
    }

    if (isAlignRight && isAlignLeft) {
        styles.position.right = "none";
        styles.position.left = `${gameContainerRect.width / 2 - extendLeft}px`;
        styles.alignArrowStyle = "center";
    }

    const betSettingHeight = 86;
    if (window.innerHeight - betOptionRect.top < betSettingHeight + popupRef.getBoundingClientRect().height) {
        styles.position.top = `${betOptionRect.bottom - popupRef.getBoundingClientRect().height - betOptionRect.height}px`;
        styles.arrowStyle = "down";
    }

    return {
        isAdjust: true,
        styles,
    };
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
