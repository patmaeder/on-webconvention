<template>
    <div id="pollVoteOverlay" v-if="poll != null">
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

let wsProvider: WebsocketProvider;
const doc = new Y.Doc();
let poll = ref(null);
let pollSharedArray = doc.getArray("poll");

const props = defineProps({
    roomID: String,
    user: Object
})

function vote (answerID) {
    pollSharedArray.get(0).get("responses").get(parseInt(answerID)).push([props.user.id]);
    poll.value = null;
}

onMounted(() => {
    wsProvider = new WebsocketProvider("ws://"+ window.location.hostname +":1234", "room/" + props.roomID + '/poll3' , doc);

    pollSharedArray.observe(event => {

        for(let value of event.changes.added) {

            poll.value = {
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
    background-color: #363A45;
    border-radius: 40px 0 0 40px;
    filter: drop-shadow(-2px -2px 6px #252830);
}

#pollVoteOverlay p {
    margin: 0;
    color: #ffffff;
    font-size: 1.2rem;
    line-height: 160%;
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
    background-color: #79F0DA;
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
    color: #252830;
    background-color: transparent;
    cursor: pointer;
}
</style>