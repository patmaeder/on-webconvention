import {io} from "socket.io-client";

export default defineNuxtPlugin(nuxtApp => {
    const socket = io("https://localhost:3030");
    nuxtApp.provide("socket", socket);
});