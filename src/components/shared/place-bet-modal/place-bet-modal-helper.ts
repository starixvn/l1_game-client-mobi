export const adjustPopupPosition = (gameBaseContainerRef: any, betOptionElement: HTMLElement, betChoiceElement: HTMLElement) => {
    const betContainerRect = gameBaseContainerRef.current.parentElement.getBoundingClientRect(),
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
        betChoiceRect = betChoiceElement.getBoundingClientRect(),
        betOptionRect = betOptionElement.getBoundingClientRect(),
        isAlignRight = Math.round(betChoiceRect.right - betContainerRect.right) === 0,
        isAlignLeft = Math.round(betContainerRect.left - betChoiceRect.left) === 0;

    let alignArrowStyle = "left";
    const popupStyle = {
        top: `${betOptionElement.getBoundingClientRect().bottom - gameContainerRect.top}px`,
        bottom: "none",
        left: `${betOptionRect.left - gameContainerRect.left}px`,
        right: "none",
    };

    if (isAlignRight) {
        popupStyle.right = `${gameContainerRect.right - betOptionRect.left - betOptionRect.width}px`;
        popupStyle.left = "none";
        alignArrowStyle = "right";
    }

    if (!isAlignRight && !isAlignLeft) {
        popupStyle.right = "none";
        popupStyle.left = `${betChoiceRect.left - gameContainerRect.left - betChoiceRect.width / 2}px`;
        alignArrowStyle = "center";
    }

    if (isAlignRight && isAlignLeft) {
        popupStyle.right = "none";
        popupStyle.left = `${betChoiceRect.width / 4 - betOptionRect.width / 2}px`;
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
) => {
    const popupRef = wrapperRef.current,
        betOptionRect = betOptionElement.getBoundingClientRect();

    if (window.innerHeight - betOptionRect.bottom < popupRef.getBoundingClientRect().height) {
        const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();

        let result = adjustPopupPosition(gameBaseContainerRef, betOptionElement, betChoiceElement);
        result.position.bottom = `${gameContainerRect.bottom - betOptionRect.top}px`;
        result.position.top = "none";

        return {
            isAdjustPosition: true,
            position: result.position,
            arrowStyle: "down",
        };
    }

    return {
        isAdjustPosition: false,
    };
};
