module.exports = {
    i18n: {
        defaultLocale: "vi",
        locales: ["vi", "en"],
        localeDetection: false,
        react: {
            transEmptyNodeValue: "", // what to return for empty Trans
            transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
            transKeepBasicHtmlNodesFor: ["br", "strong", "i"], // don't convert to <1></1> if simple react elements
            useSuspense: true,
        },
    },
};
