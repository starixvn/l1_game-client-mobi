module.exports = {
    i18n: {
        defaultLocale: "en",
        locales: ["vi", "en", "id", "th", "zh_cn", "zh_tw", "ja"],
        localeDetection: false,
        react: {
            transEmptyNodeValue: "", // what to return for empty Trans
            transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
            transKeepBasicHtmlNodesFor: ["br", "strong", "i"], // don't convert to <1></1> if simple react elements
            useSuspense: true,
        },
        fallbackLng: ["vi", "en", "id", "th", "zh_cn", "zh_tw", "ja"],
    },
};
