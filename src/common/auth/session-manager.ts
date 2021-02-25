const sessionIdStorageName = "scss";

export interface Session {
  username: string;
  language: string;
  ss: string;
  currency?: string;
  time?: Date;
  isAuthenticated: boolean;
}

export function removeSession() {
  localStorage.removeItem(getSessionKey());
}

export function getSession(): Session {
  return JSON.parse(localStorage.getItem(getSessionKey()));
}

export function storeSessionData(data: Session) {
  localStorage.setItem(getSessionKey(), JSON.stringify(data));
}

export function getSessionKey() {
  if (window.location && window.location.hostname) {
    return `${window.location.hostname}.${sessionIdStorageName}`;
  }

  return sessionIdStorageName;
}

declare global {
  export interface Window {
    authData: Session;
  }
}
