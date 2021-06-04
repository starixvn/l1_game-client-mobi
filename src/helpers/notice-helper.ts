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

    let key = `messages:${ErrorCodeDictionary[errorCode]}`;
    const isCommonErrorCode = CommonErrorCodeList.includes(errorCode);
    if (isCommonErrorCode && isPlaceBet) {
        key += "PlaceBet";
    }

    return key;
};

export const GetMessageByLocale = (data: any, locale: string): string => {
    return data[locale];
};
