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
    generateBuildId: async () => {
        return uuidv4();
    },
    excludeFile: (str) => /\*.{spec,test}.js/.test(str),
    webpack: (config, options) => {
        // In `pages/_app.js`, Sentry is imported from @sentry/browser. While
        // @sentry/node will run in a Node.js environment. @sentry/node will use
        // Node.js-only APIs to catch even more unhandled exceptions.
        //
        // This works well when Next.js is SSRing your page on a server with
        // Node.js, but it is not what we want when your client-side bundle is being
        // executed by a browser.
        //
        // Luckily, Next.js will call this webpack function twice, once for the
        // server and once for the client. Read more:
        // https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
        //
        // So ask Webpack to replace @sentry/node imports with @sentry/browser when
        // building the browser's bundle
        if (!options.isServer) {
            config.resolve.alias["@sentry/node"] = "@sentry/browser";
        }

        // Define an environment variable so source code can check whether or not
        // it's running on the server so we can correctly initialize Sentry
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
