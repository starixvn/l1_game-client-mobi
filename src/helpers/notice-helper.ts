import ErrorCodeDictionary from "../common/constants/error-code-dictionary";

type Optional = {
    gameName?: string;
    gameRoundId?: number;
    minBet?: number;
    maxBet?: number;
};

export const GetLocalizedErrorMessage = (errorCode: string) => {
    if (!ErrorCodeDictionary[errorCode]) {
        return "messages:errorOccurred";
    }
    return `messages:${ErrorCodeDictionary[errorCode]}`;
};

export const GetMessageByLocale = (data: any, locale: string): string => {
    return data[locale];
};

export const FormatMessageToArray = (message: string, opt: Optional) => {
    Object.keys(opt).forEach((key) => {
        message = message.replace(`{${key}}`, opt[key]);
    });

    return message.split("{\n}");
};
