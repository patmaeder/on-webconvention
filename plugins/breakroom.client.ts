import {IonSFUJSONRPCSignal} from "ion-sdk-js/lib/signal/json-rpc-impl";
import {Client} from "ion-sdk-js";

const config = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

export default defineNuxtPlugin(nuxtApp => {
    const signal = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
    //let client = new Client(signal, config);
    //nuxtApp.provide("client", client);
});