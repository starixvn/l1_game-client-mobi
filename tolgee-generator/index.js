const { DevTools, Tolgee } = require("@tolgee/web");
const fs = require("fs");
const path = require("path");

// Configuration
const TOLGEE_CONFIG = {
    apiKey: "tgpak_gvpw45brha2xg3btoztxeytunvudc5dbn5twqodtonztc",
    apiUrl: "https://tolgee.sabagame.com/",
    projectId: "5",
    defaultLanguage: "en",
    availableLanguages: ["en", "id", "th", "vi", "zh_cn", "zh_tw", "ja"],
    defaultNs: "messages"
};

// Namespaces to fetch from Tolgee
const NAMESPACES = [
    "messages",
    "common",
    "baccarat",
    "bethistory",
    "bigsmall",
    "dragontiger",
    "fishprawncrab",
    "sedie",
    "specialsedie",
    "threecards",
    "txturbo",
    "um",
    "vipbaccarat",
    "vipsedie",
    "kenopower1",
    "kenopower2",
    "kenopromax",
    "kenosouth",
    "kenowest",
    "megakeno",
    "megakeno2",
    "minisedie",
    "kenoeast",
    "kenomatch1",
    "kenomatch2",
    "kenomini",
    "kenomini2",
    "kenonorth",
    "register"
];

/**
 * Write file with content
 */
function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, {
        encoding: "utf8",
        flag: "w"
    });
}

/**
 * Get locales directory path
 */
function getLocalesPath() {
    return path.join(__dirname, '..', 'public', 'locales');
}

/**
 * Get existing local folders
 */
function getExistingLocalFolders() {
    const localesPath = getLocalesPath();
    
    if (!fs.existsSync(localesPath)) {
        return [];
    }
    
    return fs.readdirSync(localesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

/**
 * Parse combined locale file into individual JSON files
 * @param {string} localeDir - Path to locale directory (e.g., 'en', 'id', 'th', etc.)
 */
function parseCombinedLocales(localeDir) {
    const localesPath = getLocalesPath();
    const targetDir = path.join(localesPath, localeDir);
    const combinedFile = path.join(targetDir, 'master-translations.json');
    
    // Check if combined file exists
    if (!fs.existsSync(combinedFile)) {
        console.log(`❌ Combined file not found: ${combinedFile}`);
        return;
    }
    
    try {
        // Read combined file
        const combinedContent = fs.readFileSync(combinedFile, 'utf8');
        const combinedData = JSON.parse(combinedContent);
        
        console.log(`📁 Processing locale: ${localeDir}`);
        
        // Process each section in combined file
        Object.keys(combinedData).forEach(sectionName => {
            const sectionData = combinedData[sectionName];
            const outputFile = path.join(targetDir, `${sectionName}.json`);
            
            // Write individual file
            fs.writeFileSync(outputFile, JSON.stringify(sectionData, null, 4));
            console.log(`✅ Created: ${sectionName}.json`);
        });
        
        console.log(`🎉 Successfully parsed ${Object.keys(combinedData).length} files for ${localeDir}`);
        
    } catch (error) {
        console.error(`❌ Error processing ${localeDir}:`, error);
    }
}

/**
 * Parse all locale directories
 */
function parseAllLocales() {
    const localesPath = getLocalesPath();
    
    if (!fs.existsSync(localesPath)) {
        console.log('❌ Locales directory not found');
        return;
    }
    
    // Get all locale directories
    const localeDirs = fs.readdirSync(localesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`🔍 Found ${localeDirs.length} locale directories: ${localeDirs.join(', ')}`);
    
    // Process each locale directory
    localeDirs.forEach(localeDir => {
        parseCombinedLocales(localeDir);
    });
}

/**
 * Sync all locales from Tolgee (detect and sync all languages)
 */
async function syncAllLocales() {
    console.log("🚀 Starting automatic sync from Tolgee...");
    
    const tg = Tolgee().use(DevTools()).init({
        ...TOLGEE_CONFIG,
        ns: NAMESPACES
    });

    await tg.run();

    tg.on("initialLoad", async () => {
        console.log("📡 Connected to Tolgee, syncing all configured languages...");
        
        const localesPath = getLocalesPath();
        
        // Process each configured language
        for (const languageId of TOLGEE_CONFIG.availableLanguages) {
            console.log(`🌍 Processing language: ${languageId}`);
            
            await tg.changeLanguage(languageId);
            
            const languageData = {};
            
            // Process each namespace
            NAMESPACES.forEach((ns) => {
                const namespaceData = {};
                
                tg.getAllRecords().forEach((record) => {
                    if (record.namespace === ns) {
                        record.data.forEach((value, key) => {
                            namespaceData[key] = value;
                        });
                    }
                });
                
                if (Object.keys(namespaceData).length > 0) {
                    languageData[ns] = namespaceData;
                }
            });
            
            // Create language directory
            const languageDir = path.join(localesPath, languageId);
            if (!fs.existsSync(languageDir)) {
                fs.mkdirSync(languageDir, { recursive: true });
                console.log(`📁 Created new locale directory: ${languageId}`);
            }
            
            // Save individual namespace files
            Object.keys(languageData).forEach((namespace) => {
                const filePath = path.join(languageDir, `${namespace}.json`);
                const content = JSON.stringify(languageData[namespace], null, 4);
                writeFile(filePath, content);
                console.log(`  ✅ Saved: ${namespace}.json`);
            });
            
            // Create combined file
            const combinedFilePath = path.join(languageDir, 'master-translations.json');
            const combinedContent = JSON.stringify(languageData, null, 4);
            writeFile(combinedFilePath, combinedContent);
            console.log(`  📦 Created combined file: master-translations.json`);
        }
        
        console.log("🎉 All translations fetched and saved successfully!");
        console.log("🔄 Now parsing combined files into individual files...");
        
        // Automatically parse all locales after fetching
        parseAllLocales();
        
        console.log("🎉 Complete! All translations fetched and parsed successfully!");
        console.log(`📊 Summary: Processed ${TOLGEE_CONFIG.availableLanguages.length} languages with ${NAMESPACES.length} namespaces each`);
        process.exit(0);
    });
}

/**
 * Add missing languages automatically
 */
async function addMissingLanguages() {
    console.log("🔍 Checking for missing languages...");
    
    // Get existing local folders
    const existingFolders = getExistingLocalFolders();
    console.log(`📁 Existing local folders: ${existingFolders.join(', ')}`);
    
    // Get available languages from Tolgee config
    const availableLanguages = TOLGEE_CONFIG.availableLanguages;
    console.log(`🌍 Available languages in config: ${availableLanguages.join(', ')}`);
    
    // Find missing languages
    const missingLanguages = availableLanguages.filter(lang => !existingFolders.includes(lang));
    
    if (missingLanguages.length === 0) {
        console.log("✅ All languages are already synced! No missing languages found.");
        process.exit(0);
    }
    
    console.log(`🆕 Found ${missingLanguages.length} missing languages: ${missingLanguages.join(', ')}`);
    
    const tg = Tolgee().use(DevTools()).init({
        ...TOLGEE_CONFIG,
        ns: NAMESPACES
    });

    await tg.run();

    tg.on("initialLoad", async () => {
        console.log("📡 Connected to Tolgee, adding missing languages...");
        
        // Process each missing language
        for (const languageId of missingLanguages) {
            console.log(`🌍 Adding missing language: ${languageId}`);
            
            await tg.changeLanguage(languageId);
            
            const languageData = {};
            
            // Process each namespace
            NAMESPACES.forEach((ns) => {
                const namespaceData = {};
                
                tg.getAllRecords().forEach((record) => {
                    if (record.namespace === ns) {
                        record.data.forEach((value, key) => {
                            namespaceData[key] = value;
                        });
                    }
                });
                
                if (Object.keys(namespaceData).length > 0) {
                    languageData[ns] = namespaceData;
                }
            });
            
            // Create language directory
            const localesPath = getLocalesPath();
            const languageDir = path.join(localesPath, languageId);
            fs.mkdirSync(languageDir, { recursive: true });
            console.log(`📁 Created new locale directory: ${languageId}`);
            
            // Save individual namespace files
            Object.keys(languageData).forEach((namespace) => {
                const filePath = path.join(languageDir, `${namespace}.json`);
                const content = JSON.stringify(languageData[namespace], null, 4);
                writeFile(filePath, content);
                console.log(`  ✅ Saved: ${namespace}.json`);
            });
            
            // Create combined file
            const combinedFilePath = path.join(languageDir, 'master-translations.json');
            const combinedContent = JSON.stringify(languageData, null, 4);
            writeFile(combinedFilePath, combinedContent);
            console.log(`  📦 Created combined file: master-translations.json`);
            
            // Parse the new locale
            parseCombinedLocales(languageId);
        }
        
        console.log(`🎉 Successfully added ${missingLanguages.length} missing languages!`);
        console.log(`📊 Summary: Added ${missingLanguages.length} languages with ${NAMESPACES.length} namespaces each`);
        process.exit(0);
    });
}

/**
 * Add a specific language from Tolgee
 */
async function addSpecificLanguage(locale) {
    console.log(`🆕 Adding specific language: ${locale}`);
    
    // Check if language exists in Tolgee config
    if (!TOLGEE_CONFIG.availableLanguages.includes(locale)) {
        console.error(`❌ Language '${locale}' not found in Tolgee config`);
        console.log(`Available languages: ${TOLGEE_CONFIG.availableLanguages.join(', ')}`);
        console.log(`💡 Tip: Use 'npm run tolgee:sync' to sync all languages or 'npm run tolgee:add' to add missing languages`);
        process.exit(1);
    }
    
    const tg = Tolgee().use(DevTools()).init({
        ...TOLGEE_CONFIG,
        ns: NAMESPACES
    });

    await tg.run();

    tg.on("initialLoad", async () => {
        await tg.changeLanguage(locale);
        
        const localesPath = getLocalesPath();
        const languageDir = path.join(localesPath, locale);
        
        // Check if directory already exists
        if (fs.existsSync(languageDir)) {
            console.log(`⚠️  Language directory '${locale}' already exists. Overwriting...`);
        } else {
            fs.mkdirSync(languageDir, { recursive: true });
            console.log(`📁 Created new locale directory: ${locale}`);
        }
        
        const languageData = {};
        
        NAMESPACES.forEach((ns) => {
            const namespaceData = {};
            
            tg.getAllRecords().forEach((record) => {
                if (record.namespace === ns) {
                    record.data.forEach((value, key) => {
                        namespaceData[key] = value;
                    });
                }
            });
            
            if (Object.keys(namespaceData).length > 0) {
                languageData[ns] = namespaceData;
            }
        });
        
        // Save individual namespace files
        Object.keys(languageData).forEach((namespace) => {
            const filePath = path.join(languageDir, `${namespace}.json`);
            const content = JSON.stringify(languageData[namespace], null, 4);
            writeFile(filePath, content);
            console.log(`  ✅ Saved: ${namespace}.json`);
        });
        
        // Create combined file
        const combinedFilePath = path.join(languageDir, 'master-translations.json');
        const combinedContent = JSON.stringify(languageData, null, 4);
        writeFile(combinedFilePath, combinedContent);
        console.log(`  📦 Created combined file: master-translations.json`);
        
        console.log(`🔄 Now parsing combined file for ${locale}...`);
        
        // Automatically parse the new locale
        parseCombinedLocales(locale);
        
        console.log(`🎉 Complete! Language '${locale}' added and parsed successfully!`);
        process.exit(0);
    });
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const locale = args[1];
    
    try {
        if (command === 'sync') {
            // Sync all languages from Tolgee
            await syncAllLocales();
        } else if (command === 'add') {
            if (!locale) {
                // Auto-detect and add missing languages
                await addMissingLanguages();
            } else {
                // Add specific language
                await addSpecificLanguage(locale);
            }
        } else {
            console.log(`
🌍 Tolgee Translation Generator

Usage:
  npm run tolgee:sync                    - 🚀 Sync all languages from Tolgee
  npm run tolgee:add                     - ➕ Auto-detect and add missing languages
  npm run tolgee:add <locale>            - ➕ Add a specific language (e.g., fr, de, es)

Quick Start (Recommended):
  npm run tolgee:sync                    - Sync everything!
  npm run tolgee:add                     - Add only missing languages

Examples:
  npm run tolgee:sync
  npm run tolgee:add
  npm run tolgee:add fr
            `);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { syncAllLocales, addMissingLanguages, addSpecificLanguage }; 