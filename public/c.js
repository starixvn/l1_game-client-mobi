window.envConfig = {
    subSocketGatewayDomain: "l2-gw",
    serverDomainMapper: {
        localhost: "lumigame.com",
    },
    proxy: {
        ssl: true,
        subDomain: "l2-proxy",
        path: "",
    },
    sentry: {
        dsn: "https://c8f93631be824a14b9f114f53e3a2bfc@sentry.lumigame.com/3",
        environment: "LOCAL_1",
    },
    enableSourceMap: true,
    subGuideDomain: "l1-guide",
    enableMsgpackParser: false,
    system: "L2",
    appType: 2,
    isTesting: true,
};
