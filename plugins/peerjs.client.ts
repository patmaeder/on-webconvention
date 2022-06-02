import { Peer } from "peerjs";

export default defineNuxtPlugin(nuxtApp => {
    const peer = new Peer(undefined, {
        path: '/peerjs',
        host: "/",
        port: 3030,
        secure: false
    });
    nuxtApp.provide('peer', peer);
})