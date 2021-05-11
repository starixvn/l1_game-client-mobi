import { Listener } from "./type";
import { v4 as uuidv4 } from "uuid";

export default function messageTransmitter() {
    let listeners: Array<Listener> = [];

    const register = (messageKey: string, handleMessage: Function) => {
        const listenerId = uuidv4();
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
