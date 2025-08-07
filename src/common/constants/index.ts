import { getAppSettings } from "../app-settings";
import { getLocalStorageItem, localStorageKeys } from "../local-storage";

export const systemName = getAppSettings().system.toLocaleLowerCase();

export const isL1System = () => {
    return systemName === "l1";
};

export const isSabaPlay = (operator?: string) => {
    const storedOperator = getLocalStorageItem(localStorageKeys.operator)
    const currentOperator = storedOperator ? storedOperator : operator;
    return currentOperator === "SP";
};

export const locales = { en: "en", vi: "vi", th: "th", id: "id", zh_cn: "zh_cn", zh_tw: "zh_tw", ja: "ja", es: "es" };

export const languageMapper = { "en-US": "en", "vi-VN": "vi", "th-TH": "th", "id-ID": "id", "zh-CN": "zh_cn", "zh-TW": "zh_tw", "ja-JP": "ja", "es-ES": "es" };

export const LanguageLocaleMapper = {
    en: "en-US",
    vi: "vi-VN",
    th: "th-TH",
    id: "id-ID",
    zh_cn: "zh-CN",
    zh_tw: "zh-TW",
    ja: "ja-JP",
    es: "es-ES",
};

export const languageNameMapper = { en: "English", vi: "Tiếng Việt" };

export const Themes = {
    light: "light",
};

export const sabaMobileName = "Saba.mobi";
export const sabaClubName = "Saba.games";
export const vGamingMobileName = "Vgaming Mobi";
export const vGamingName = "Vgaming";
export const sabaPlayMobileName = "SABAPLAY Table Games";
export const sabaPlayKenoName = "SABAPLAY Keno";
export const sabaPlayName = "SABAPLAY";

export const buildVersion = process.env.buildVersion;
export const AppTypes = {
    mobile: 2,
    megaKeno: 4,
};
export const maximumAvatarId = 172;
