import React from "react";

import { Session } from "../../services/user/user";

export const AuthContext = React.createContext<Session>({ isAuthenticated: false, ss: "", username: "", language: "" });
AuthContext.displayName = "AuthContext";

export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;
export const useAuthContext = () => React.useContext(AuthContext);
