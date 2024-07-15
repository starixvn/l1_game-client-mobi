window.envConfig = {
    subSocketGatewayDomain: "l2-gw1",
    serverDomainMapper: {
        localhost: "lumigame.com",
    },
    proxy: {
        ssl: true,
        subDomain: "l2-proxy1",
        path: "",
    },
    sentry: {
        dsn: "https://c8f93631be824a14b9f114f53e3a2bfc@sentry.lumigame.com/3",
        environment: "LOCAL_1",
    },
    enableSourceMap: true,
    subGuideDomain: "l2-guide-1",
    enableMsgpackParser: false,
    system: "L2",
    appType: 2,
    subPromotionDomain: "l2-promotion1",
};
