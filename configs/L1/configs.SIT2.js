window.envConfig = {
    subSocketGatewayDomain: "l1gwsit",
    serverDomainMapper: {
        "m.sabagames.io": "sgamesuat.com",
    },
    proxy: {
        ssl: true,
        subDomain: "l1uatproxy",
        path: "/sit",
    },
    sentry: {
        dsn: "https://936d6f9d99064ccdab5bece39bc3bc07@scsentry.sgamesuat.com/258",
        environment: "SIT",
    },
    enableSourceMap: false,
    subGuideDomain: "l1guidessit",
    googleAnalyticId: "G-X1Q507KDPB",
    enableMsgpackParser: true,
    system: "L1",
    appType: 2,
    isTesting: true,
};
