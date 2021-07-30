export const buildChips = (maxBetChoice: number) => {
    return [
        {
            style: "chip-1",
            value: 1,
            isPlusValue: true,
        },
        {
            style: "chip-3",
            value: 10,
            isPlusValue: true,
        },
        {
            style: "chip-6",
            value: 100,
            isPlusValue: true,
        },
        {
            style: "chip-8",
            value: 500,
            isPlusValue: true,
        },
        {
            style: "chip-13",
            value: maxBetChoice,
            isPlusValue: false,
        },
    ];
};

export const buildVIPChips = (maxBetChoice: number) => {
    return [
        {
            style: "chip-3",
            value: 10,
            isPlusValue: true,
        },
        {
            style: "chip-5",
            value: 50,
            isPlusValue: true,
        },
        {
            style: "chip-6",
            value: 100,
            isPlusValue: true,
        },
        {
            style: "chip-8",
            value: 500,
            isPlusValue: true,
        },
        {
            style: "chip-13",
            value: maxBetChoice,
            isPlusValue: false,
        },
    ];
};

export const ajustPopupPosition = (gameBaseContainerRef: any, betOptionElement: HTMLElement, betChoiceElement: HTMLElement) => {
    const betContainerRect = gameBaseContainerRef.current.parentElement.getBoundingClientRect(),
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
        betChoiceRect = betChoiceElement.getBoundingClientRect(),
        betOptionRect = betOptionElement.getBoundingClientRect(),
        isAlignRight = Math.round(betChoiceRect.right - betContainerRect.right) === 0,
        isAlignLeft = Math.round(betContainerRect.left - betChoiceRect.left) === 0;

    let alignArrowStyle = "left";
    let popupStyle = {
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

export const ajustPopupPositionDidUpdate = (
    gameBaseContainerRef: any,
    wrapperRef: any,
    betOptionElement: HTMLElement,
    betChoiceElement: HTMLElement
) => {
    const popupRef = wrapperRef.current,
        betOptionRect = betOptionElement.getBoundingClientRect();

    if (window.innerHeight - betOptionRect.bottom < popupRef.getBoundingClientRect().height) {
        const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();

        let result = ajustPopupPosition(gameBaseContainerRef, betOptionElement, betChoiceElement);
        result.position.bottom = `${gameContainerRect.bottom - betOptionRect.top}px`;
        result.position.top = "none";

        return {
            isAjustPosition: true,
            position: result.position,
            arrowStyle: "down",
        };
    }

    return {
        isAjustPosition: false,
    };
};
