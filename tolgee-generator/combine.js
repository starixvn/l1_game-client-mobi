const fs = require('fs');
const path = require('path');

/**
 * Combine JSON files in a locale directory
 */
function combineLocaleFiles(localeDir) {
    const localesPath = path.join(__dirname, '..', 'public', 'locales');
    const targetDir = path.join(localesPath, localeDir);
    
    if (!fs.existsSync(targetDir)) {
        console.log(`❌ Locale directory not found: ${targetDir}`);
        return;
    }
    
    try {
        const combinedData = {};
        
        // Read all JSON files in the directory
        const files = fs.readdirSync(targetDir)
            .filter(file => file.endsWith('.json') && file !== 'master-translations.json');
        
        console.log(`📁 Combining files for locale: ${localeDir}`);
        console.log(`📄 Found ${files.length} files to combine`);
        
        files.forEach(file => {
            const filePath = path.join(targetDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            
            // Use filename without extension as section name
            const sectionName = path.basename(file, '.json');
            combinedData[sectionName] = data;
            
            console.log(`✅ Added: ${file}`);
        });
        
        // Write combined file
        const combinedFile = path.join(targetDir, 'master-translations.json');
        fs.writeFileSync(combinedFile, JSON.stringify(combinedData, null, 4));
        console.log(`🎉 Created combined file: master-translations.json`);
        console.log(`📊 Summary: Combined ${Object.keys(combinedData).length} files`);
        
    } catch (error) {
        console.error(`❌ Error combining files for ${localeDir}:`, error.message);
    }
}

/**
 * Parse combined locale file into individual JSON files
 */
function parseLocaleFiles(localeDir) {
    const localesPath = path.join(__dirname, '..', 'public', 'locales');
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
        
        console.log(`📁 Parsing files for locale: ${localeDir}`);
        console.log(`📄 Found ${Object.keys(combinedData).length} sections to parse`);
        
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
        console.error(`❌ Error parsing files for ${localeDir}:`, error.message);
    }
}

/**
 * Parse all locale directories
 */
function parseAllLocales() {
    const localesPath = path.join(__dirname, '..', 'public', 'locales');
    
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
        parseLocaleFiles(localeDir);
    });
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];
const locale = args[1];

if (command === 'combine' && locale) {
    combineLocaleFiles(locale);
} else if (command === 'parse' && locale) {
    parseLocaleFiles(locale);
} else if (command === 'parse' && !locale) {
    parseAllLocales();
} else if (command === 'combine' && !locale) {
    console.log('❌ Please specify a locale for combine command');
} else {
    console.log(`
📦 JSON File Processor

Usage:
  node tolgee-generator/combine.js combine <locale>  - Combine individual files into master-translations.json
  node tolgee-generator/combine.js parse <locale>    - Parse master-translations.json into individual files
  node tolgee-generator/combine.js parse             - Parse all locales

Examples:
  node tolgee-generator/combine.js combine ja
  node tolgee-generator/combine.js parse ja
  node tolgee-generator/combine.js parse
    `);
} 