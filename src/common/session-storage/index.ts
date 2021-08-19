export const SessionStorageKeys = {
    betSetting: "bet-settings",
};

export function removeSessionStorageItem(key: string) {
    sessionStorage.removeItem(key);
}

export function storeSessionStorageItem<Type>(key: string, data: Type) {
    sessionStorage.setItem(key, JSON.stringify(data));
}

export function getSessionStorageItem<Type>(key: string): Type {
    return JSON.parse(sessionStorage.getItem(key));
}
