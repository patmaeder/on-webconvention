import { LocalStream, Client } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.provide("localStream", LocalStream);
    nuxtApp.provide("client", Client);
    nuxtApp.provide("jsonRPC", IonSFUJSONRPCSignal);
});