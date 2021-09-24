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
    isMobileOnly: boolean,
    gameBaseContainerRef: any,
    betOptionElement: HTMLElement,
    betChoiceElement: HTMLElement
): BetFormCss => {
    return isMobileOnly
        ? adjustPopupPositionMobile(gameBaseContainerRef, betOptionElement)
        : adjustPopupPositionDesktop(gameBaseContainerRef, betOptionElement, betChoiceElement);
};

export const adjustPopupPositionMobile = (gameBaseContainerRef: any, betOptionElement: HTMLElement): BetFormCss => {
    const betOptionRect = betOptionElement.getBoundingClientRect(),
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();

    return {
        position: {
            top: `${betOptionRect.bottom - gameContainerRect.top}px`,
        },
        arrowStyle: "up",
        alignArrowStyle: "left",
        arrowStyleLeft: `${betOptionRect.left + betOptionRect.width / 2}px`,
    };
};

export const adjustPopupPositionDesktop = (gameBaseContainerRef: any, betOptionElement: HTMLElement, betChoiceElement: HTMLElement) => {
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
    isMobileOnly: boolean,
    gameBaseContainerRef: any,
    wrapperRef: any,
    betOptionElement: HTMLElement,
    betChoiceElement: HTMLElement
): AdjustedBetFormCss => {
    const popupRef = wrapperRef.current,
        betOptionRect = betOptionElement.getBoundingClientRect();

    if (window.innerHeight - betOptionRect.bottom < popupRef.getBoundingClientRect().height) {
        const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();
        const bottom =
            betOptionRect.top > popupRef.getBoundingClientRect().height
                ? gameContainerRect.bottom - betOptionRect.top
                : betOptionRect.bottom + 15;

        let styles = adjustPopupPosition(isMobileOnly, gameBaseContainerRef, betOptionElement, betChoiceElement);
        styles.position.bottom = `${bottom}px`;
        styles.position.top = "none";
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
