import React from "react";

import { SSOResponse } from "sc-user-service-client/dist/auth";

export const AuthContext = React.createContext<SSOResponse>({ isAuthenticated: false, ss: "", username: "", language: "" });
AuthContext.displayName = "AuthContext";

export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;
export const useAuthContext = () => React.useContext(AuthContext);
