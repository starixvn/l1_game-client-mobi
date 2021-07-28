import { popupOverflowMargin } from "./place-bet-constant";

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

export const ajustPopupPosition = (gameBaseContainerRef: any, eventPosition: any) => {
    const betContainerRect = gameBaseContainerRef.current.parentElement.getBoundingClientRect(),
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
        isAlignRight = Math.round(eventPosition.right - betContainerRect.right) === 0,
        isAlignLeft = Math.round(betContainerRect.left - eventPosition.left) === 0;

    let alignArrowStyle = "left";
    let popupStyle = {
        top: `${eventPosition.y - gameContainerRect.y + eventPosition.height - popupOverflowMargin}px`,
        bottom: "none",
        left: `${popupOverflowMargin}px`,
        right: "none",
    };

    if (isAlignRight) {
        (popupStyle.right = `${popupOverflowMargin}px`), (popupStyle.left = "none");
        alignArrowStyle = "right";
    }

    if (!isAlignRight && !isAlignLeft) {
        popupStyle.right = "none";
        popupStyle.left = `${eventPosition.x - gameContainerRect.x - eventPosition.width / 2}px`;
        alignArrowStyle = "center";
    }

    if (isAlignRight && isAlignLeft) {
        popupStyle.right = "none";
        popupStyle.left = `${eventPosition.width / 4}px`;
        alignArrowStyle = "center";
    }

    return {
        position: popupStyle,
        arrowStyle: "up",
        alignArrowStyle,
    };
};

export const ajustPopupPositionDidUpdate = (gameBaseContainerRef: any, wrapperRef: any, eventPosition: any) => {
    const bottomMargin = -10,
        gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect();

    if (gameContainerRect.bottom - window.innerHeight > bottomMargin) {
        const gameContainerRect = gameBaseContainerRef.current.parentElement.parentElement.getBoundingClientRect(),
            popupRef = wrapperRef.current,
            popupTop = eventPosition.y - gameContainerRect.y - popupRef.getBoundingClientRect().height + popupOverflowMargin;

        let result = ajustPopupPosition(gameBaseContainerRef, eventPosition);
        result.position.top = `${popupTop}px`;
        result.position.bottom = "none";

        return {
            isAjustPosition: true,
            position: result.position,
            arrowStyle: "down",
        };
    }

    return {
        isAjustPosition: false
    }
};
