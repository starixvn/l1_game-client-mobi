import { Listener } from "./type";

export default function messageTransmitter() {
    let listeners: Array<Listener> = [];

    const register = (messageKey: string, handleMessage: Function) => {
        const listenerId = messageKey + Math.floor(Math.random() * Date.now());
        listeners.push({ messageKey, listenerId, handleMessage });

        return listenerId;
    };

    const unsubscribe = (listenerId: string) => {
        const listenerIndex = listeners.findIndex((listener) => listener.listenerId === listenerId);

        listeners.splice(listenerIndex, 1);
    };

    const clearAllListener = () => (listeners = []);

    const broadcast = (message: any) => {
        listeners.forEach((listener) => message[listener.messageKey] && listener.handleMessage(message));
    };

    return {
        register,
        unsubscribe,
        clearAllListener,
        broadcast,
    };
}
