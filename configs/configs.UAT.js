module.exports = {
    proxy: {
        ssl: true,
        uri: "uatproxy.sabagame.com",
        path: "/uat"
    },
    sentry: {
        dns: "http://936d6f9d99064ccdab5bece39bc3bc07@10.99.99.187:800/258",
        environment: "UAT"
    },
    offeredGames: [2, 22, 3, 1, 4, 7],
};
