import { Listener } from "./type";

export default function messageTransmitter() {
    let listeners: Array<Listener> = [];

    return {
        addListener: (key: string, handleMessage: Function) => listeners.push({ key, handleMessage }),
        clearAllListener: () => (listeners = []),
        broadcast: (message: any) => {
            listeners.forEach((listener) => message[listener.key] && listener.handleMessage(message));
        },
    };
}
