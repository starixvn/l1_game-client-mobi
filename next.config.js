const basePath = "";
const gameSettings = require("./game-settings.json");
const configs = require("./configs.json");
const { i18n } = require("./next-i18next.config");
const { v4: uuidv4 } = require("uuid");

const appSettings = {
    ...configs,
    gameSettings,
};

module.exports = {
    i18n,
    future: {
        webpack5: true,
    },
    publicRuntimeConfig: appSettings,
    productionBrowserSourceMaps: configs.enableSourceMap,
    generateBuildId: async () => {
        return uuidv4();
    },
    excludeFile: (str) => /\*.{spec,test}.js/.test(str),
    webpack: (config, options) => {
        if (!options.isServer) {
            config.resolve.alias["@sentry/node"] = "@sentry/browser";
        }

        config.plugins.push(
            new options.webpack.DefinePlugin({
                "process.env.NEXT_IS_SERVER": JSON.stringify(options.isServer.toString()),
            })
        );

        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2|mp3)$/,
            use: {
                loader: "url-loader",
                options: {
                    limit: 100000,
                },
            },
        });

        return config;
    },
    async redirects() {
        return [
            {
                source: "/index/en",
                destination: "/index/vi",
                permanent: true,
            },
        ];
    },
    basePath,
};
