<template>
    <div id="pollVoteOverlay" v-if="poll != null && poll.initiator != store.session.email">
        <p>{{ poll.question }}</p>
        <ul>
            <li v-for="(answer, key) in poll.answers" :key="key">
                <button @click="vote(key)">
                    {{ answer }}
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket";
import { useStore } from "~/store";

const store = useStore();
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const roomId = route.params.roomId;
let wsProvider: WebsocketProvider;
const doc = new Y.Doc();
let poll = ref(null);
let pollSharedArray = doc.getArray("poll");

function vote (answerID) {
    pollSharedArray.get(0).get("responses").get(parseInt(answerID)).push([store.session.email]);
    poll.value = null;
}

onMounted(() => {
    wsProvider = new WebsocketProvider(runtimeConfig.YJS_HOST, "room/" + roomId + '/poll' , doc);

    pollSharedArray.observe(event => {

        for(let value of event.changes.added) {

            poll.value = {
                initiator: pollSharedArray.get(0).get("initiator"),
                question: pollSharedArray.get(0).get("question"),
                answers: pollSharedArray.get(0).get("answers"),
            }; 
        }

        for(let value of event.changes.deleted) {
            poll.value = null;
        }
    })

    window.onbeforeunload = function () {
        wsProvider.disconnect();
    }
})
</script>

<style>
#pollVoteOverlay {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 450px;
    padding: 50px;
    padding-top: 36px;
    background-color: #31353f;
    border-radius: 40px 0 0 40px;
    box-shadow: 0 -8px 14px rgba(0, 0, 0, .25);
}

#pollVoteOverlay p {
    margin: 0;
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 160%;
    text-align: center;
}

#pollVoteOverlay ul {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 40px 0 0 0;
    list-style-type: none;
}

#pollVoteOverlay ul li:not(:first-child) {
    margin-top: 14px;   
}

#pollVoteOverlay ul li {
    display: flex;
    min-height: 38px;
    background: linear-gradient(165deg, rgba(121,240,218,1) 0%, rgba(59,86,149,1) 100%);
    border-radius: 10px;
    overflow: hidden;
}

#pollVoteOverlay ul li button {
    flex-grow: 1;
    padding: 10px;
    border: none;
    outline: none;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 160%;
    color: #ffffff;
    background-color: transparent;
    cursor: pointer;
}
</style>