// Polyfill for Headers and fetch API in Node.js environment
if (typeof global !== 'undefined') {
    if (!global.Headers) {
        global.Headers = require('node-fetch').Headers;
    }
    if (!global.fetch) {
        global.fetch = require('node-fetch');
    }
}

const { DevTools, Tolgee } = require("@tolgee/web");
const fs = require("fs");
const path = require("path");
const gameSettings = require("../game-settings.json");

const locales = { en: "en", vi: "vi", id: "id", th: "th", "zh-Hans": "zh-Hans", "zh-Hant": "zh-Hant", "es": "es" };

const folderNameMapping: { [key: string]: string } = {
    "zh-Hans": "zh_cn",
    "zh-Hant": "zh_tw"
};

function writeFile(fileName: string, content: string, extension = "json") {
    const dirname = path.dirname(fileName);
    const fullPath = `${fileName}.${extension}`;

    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }

    try {
        fs.writeFileSync(fullPath, content, {
            encoding: "utf8",
            flag: "w",
        });
    } catch (error) {
        console.error(`Error writing file ${fullPath}:`, error);
    }
}

interface GameSettings {
    tolgeeNamespace?: string;
}

const tmpGameSettings: { [id: string]: GameSettings } = gameSettings;

const tolgeeNamespaceByGameSetting = Object.values(tmpGameSettings)
    .map((setting) => setting.tolgeeNamespace)
    .filter((ns) => ns);

// Add additional namespaces that are not in gameSettings
const additionalNamespaces = ["BetHistory", "UM", "Register", "Messages"];

const namespaces = ["Common", ...tolgeeNamespaceByGameSetting, ...additionalNamespaces].filter((value, index, arr) => arr.indexOf(value) === index);

const tg = Tolgee().use(DevTools()).init({
    defaultLanguage: "en",
    fallbackLanguage: "en",
    availableLanguages: Object.values(locales),
    apiKey: "tgpak_geyf63tumfrhi33pha2g44deovsgu5dbnzuwq3bzoq4hczi",
    apiUrl: "https://tolgee.sabagame.com/",
    projectId: "10",
    ns: namespaces,
});

tg.run();

tg.on("initialLoad", async () => {
    const languages: {
        [languageId: string]: {
            [ns: string]: {
                [key: string]: string;
            };
        };
    } = {};
    
    // Initialize languages object
    Object.values(locales).forEach((languageId: string) => {
        languages[languageId] = {};
        namespaces.forEach((namespace: any) => {
            languages[languageId][namespace] = {};
        });
    });

    // Load data for each language
    for (const languageId of Object.values(locales)) {
        await tg.changeLanguage(languageId);
        
        tg.getAllRecords().forEach((record) => {
            namespaces.forEach((namespace: any) => {
                if (record.namespace === namespace) {
                    record.data.forEach((value, key) => {
                        languages[languageId as string][namespace][key] = value as string;
                    });
                }
            });
        });
    }

    Object.values(locales).forEach((languageId) => {
        namespaces.forEach((namespace: any) => {
            const namespaceData = languages[languageId as string][namespace];

            if (Object.keys(namespaceData).length > 0) {
                const filename = namespace.toLowerCase();
                // Use folder name mapping for zh-cn and zh-tw
                const folderName = folderNameMapping[languageId] || languageId;
                console.log(`Writing file: ${folderName}/${filename}`);
                writeFile(`../public/locales/${folderName}/${filename}`, JSON.stringify(namespaceData, null, 4));
            }
        });
    });

    console.log("Tolgee data generation completed!");
});