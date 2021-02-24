export const configs = {
  ssl: false,
  serverDomainMapper: {
    localhost: "127.0.0.1",
    "10.5.10.14": "lumigame.com",
  },
  serverGameEndPoints: {
    0: {
      //Main Server
      subDomain: "",
      port: 5000,
      path: "",
      proxyRoute: "/main",
    },
    2: {
      subDomain: "",
      port: "7000",
      path: "/user/xocxoc",
      proxyRoute: "/sedie/socket.io",
    },
  },
  userServiceUrl: "http://localhost:5000",
};
