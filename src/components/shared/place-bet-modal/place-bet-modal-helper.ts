interface BetFormPositionCss {
    top: string;
    bottom: string;
    right?: string;
    left?: string;
}

export interface BetFormCss {
    position: BetFormPositionCss;
    arrowStyle: string;
    alignArrowStyle: string;
    arrowStyleLeft?: string;
}

export const adjustPopupPositionMobile = (gameBaseContainerRef: any, betOptionElement: HTMLElement): BetFormCss => {
    const betOptionRect = betOptionElement.getBoundingClientRect(),
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();

    return {
        position: {
            top: `${betOptionRect.bottom - gameContainerRect.top}px`,
            bottom: "none",
        },
        arrowStyle: "up",
        alignArrowStyle: "left",
        arrowStyleLeft: `${betOptionRect.left + betOptionRect.width / 2}px`,
    };
};

export const adjustPopupPositionDesktop = (
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

export const adjustPopupPosition = (
    isMobileOnly: boolean,
    gameBaseContainerRef: any,
    betOptionElement: HTMLElement,
    betChoiceElement: HTMLElement
): BetFormCss => {
    const betOptionRect = betOptionElement.getBoundingClientRect(),
    popupHeight = 384;

    let result = isMobileOnly
        ? adjustPopupPositionMobile(gameBaseContainerRef, betOptionElement)
        : adjustPopupPositionDesktop(gameBaseContainerRef, betOptionElement, betChoiceElement);

    if (window.innerHeight - betOptionRect.bottom < popupHeight) {
        const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();
        result.position.bottom = `${gameContainerRect.bottom - betOptionRect.top}px`;
        result.position.top = "none";
        result.arrowStyle = "down";
    }

    return result;
};
