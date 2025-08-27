const basePath = "";
const gameSettings = require("./game-settings.json");
const configs = require("./configs.json");
const { i18n } = require("./next-i18next.config");
const { v4: uuidv4 } = require("uuid");
const { withSentryConfig } = require("@sentry/nextjs");

const appSettings = {
    ...configs,
    gameSettings,
};

module.exports = withSentryConfig({
    i18n,
    publicRuntimeConfig: appSettings,
    productionBrowserSourceMaps: configs.enableSourceMap,
    sentry: {
        disableServerWebpackPlugin: true,
        disableClientWebpackPlugin: true,
    },
    generateBuildId: async () => {
        return uuidv4();
    },
    excludeFile: (str) => /\*.{spec,test}.js/.test(str),
    // Next.js has built-in support for static assets, no need for url-loader
    webpack: (config, options) => {
        // Disable source maps
        config.devtool = false;

        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|mp3|webp)$/,
            type: 'asset',  
            parser: {
                dataUrlCondition: {
                    maxSize: 100 * 1024,
                },
            },
        });

        return config;
    },
    basePath,
    env: {
        buildVersion: uuidv4(),
    },
    async rewrites() {
        return [
            {
                source: "/health",
                destination: "/api/health",
            },
        ];
    },
});
