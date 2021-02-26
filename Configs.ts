const configs = {
  ssl: false,
  serverDomainMapper: {
    localhost: "localhost",
    "10.5.10.14": "lumigame.com",
  },
  serverGameEndPoints: {
    0: {
      //Main Server
      subDomain: "",
      port: 5000,
      path: "",
      proxyRoute: "",
    },
    1: {
      subDomain: "",
      port: "8082",
      path: "/user/xocxoc",
      proxyRoute: "",
    },
  },
  sentryUrl:
    "https://bb445a2db0534a549906991ccf4bf895@sentryuat.sabagame.com/20",
  userServiceUrl: "http://localhost:5000",
  sedieServiceUrl: "http://localhost:8082",
};

export default configs;
