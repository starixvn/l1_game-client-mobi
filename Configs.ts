export const configs = {
  ssl: false,
  serverDomainMapper: {
    localhost: "lumigame.com",
    "10.5.10.14": "lumigame.com",
  },
  serverGameEndPoints: {
    0: {
      //Main Server
      subDomain: "haproxy",
      port: 7000,
      path: "",
      proxyRoute: "/main",
    },
    2: {
      subDomain: "haproxy",
      port: "7000",
      path: "/user/xocxoc",
      proxyRoute: "/sedie/socket.io",
    },
  },
};
