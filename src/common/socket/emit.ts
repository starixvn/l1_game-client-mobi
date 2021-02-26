import * as SessionManager from "../../common/auth/session-manager";

export const SignIn = (socket) => {
  console.log("-------SignIn-----------");
  console.log(SessionManager.getSession());
  socket.emit("signin", SessionManager.getSession());
};
export const inGame = (socket) => {
  socket.emit("inGame");
};

export const betData = (socket, data) => {
  socket.emit("bet", data);
};

export const getHistory = (socket, page = 1) => {
  socket.emit("getHistory", { page: page });
};

export const sendData = (socket, key: string, data: any) => {
  socket.emit(key, data);
};
