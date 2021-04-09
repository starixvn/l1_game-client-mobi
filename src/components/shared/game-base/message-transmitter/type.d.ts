export interface MessageTransmitterType {
    addListener(key: string, listener: Function);
    clearAllListener();
    broadcast(message: any);
}

export interface Listener {
    key: string;
    handleMessage: Function;
}
