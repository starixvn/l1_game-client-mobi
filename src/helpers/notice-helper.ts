import ErrorCodeDictionary, { CommonErrorCodeList } from "../common/constants/error-code-dictionary";

type Optional = {
    gameName?: string;
    gameRoundId?: number;
    minBet?: number;
    maxBet?: number;
};

export const GetLocalizedErrorMessage = (errorCode: string, isPlaceBet = false) => {
    if (!ErrorCodeDictionary[errorCode]) {
        return "messages:errorOccurred";
    }

    let key = ErrorCodeDictionary[errorCode];
    const isCommonErrorCode = CommonErrorCodeList.includes(ErrorCodeDictionary[errorCode]);
    console.log(isCommonErrorCode);
    console.log(isPlaceBet);
    if (isCommonErrorCode && isPlaceBet) {
        console.log("isPlaceBet");
        key = `${key}PlaceBet`;
    }

    return `messages:${key}`;
};

export const GetMessageByLocale = (data: any, locale: string): string => {
    return data[locale];
};
