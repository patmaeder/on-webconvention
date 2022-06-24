<template>
    <div id="pollCreateOverlay" v-if="pollState != 'open' || poll.initiator == store.session.email">

        <button v-if="!showPopover" @click="showPopover = !showPopover">
            Umfrage
        </button>

        <button v-else-if="showPopover && pollState == 'none'" @click="startPoll">
            Umfrage starten
        </button>

        <button v-else-if="showPopover && pollState == 'open'" @click="closePoll">
            Umfrage schließen
        </button>

        <button v-else-if="showPopover && pollState == 'closed'" @click="{poll = null; pollState = 'none'}">
            Neue Umfrage
        </button>

        <div id="pollCreatePopover" v-if="showPopover">
            <button @click="showPopover = !showPopover">
                <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.698874 0.698874C1.1465 0.251385 1.75353 0 2.38647 0C3.01941 0 3.62644 0.251385 4.07406 0.698874L12.5144 9.13923L20.9548 0.698874C21.405 0.264067 22.0079 0.0234734 22.6338 0.028912C23.2596 0.0343505 23.8583 0.285386 24.3009 0.727951C24.7434 1.17052 24.9945 1.7692 24.9999 2.39506C25.0053 3.02092 24.7648 3.62387 24.3299 4.07406L15.8896 12.5144L24.3299 20.9548C24.7648 21.405 25.0053 22.0079 24.9999 22.6338C24.9945 23.2596 24.7434 23.8583 24.3009 24.3009C23.8583 24.7434 23.2596 24.9945 22.6338 24.9999C22.0079 25.0053 21.405 24.7648 20.9548 24.3299L12.5144 15.8896L4.07406 24.3299C3.62387 24.7648 3.02092 25.0053 2.39506 24.9999C1.7692 24.9945 1.17052 24.7434 0.727951 24.3009C0.285386 23.8583 0.0343505 23.2596 0.028912 22.6338C0.0234734 22.0079 0.264067 21.405 0.698874 20.9548L9.13923 12.5144L0.698874 4.07406C0.251385 3.62644 0 3.01941 0 2.38647C0 1.75353 0.251385 1.1465 0.698874 0.698874Z" fill="#ffffff"/>
                </svg>
            </button>

            <form ref="pollContent" v-if="poll == null" @submit="(event) => {event.preventDefault()}" class="pollCreatePopover_content">
                <p>Umfrage erstellen</p>
                <div>
                    <label for="question">Frage:</label>
                    <input type="text" name="question" placeholder="Frage" required>
                </div>
                <div>
                    <label>Antwortmöglichkeiten</label>
                    <ul>
                        <li v-for="(answer, key) in answerCount" :key="answer" >
                            <input type="text" :name="'answer[x]'.replace('x', key.toString())" placeholder="Antwort" required>
                            <span @click="answerCount.splice(key, 1)" >
                                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.698874 0.698874C1.1465 0.251385 1.75353 0 2.38647 0C3.01941 0 3.62644 0.251385 4.07406 0.698874L12.5144 9.13923L20.9548 0.698874C21.405 0.264067 22.0079 0.0234734 22.6338 0.028912C23.2596 0.0343505 23.8583 0.285386 24.3009 0.727951C24.7434 1.17052 24.9945 1.7692 24.9999 2.39506C25.0053 3.02092 24.7648 3.62387 24.3299 4.07406L15.8896 12.5144L24.3299 20.9548C24.7648 21.405 25.0053 22.0079 24.9999 22.6338C24.9945 23.2596 24.7434 23.8583 24.3009 24.3009C23.8583 24.7434 23.2596 24.9945 22.6338 24.9999C22.0079 25.0053 21.405 24.7648 20.9548 24.3299L12.5144 15.8896L4.07406 24.3299C3.62387 24.7648 3.02092 25.0053 2.39506 24.9999C1.7692 24.9945 1.17052 24.7434 0.727951 24.3009C0.285386 23.8583 0.0343505 23.2596 0.028912 22.6338C0.0234734 22.0079 0.264067 21.405 0.698874 20.9548L9.13923 12.5144L0.698874 4.07406C0.251385 3.62644 0 3.01941 0 2.38647C0 1.75353 0.251385 1.1465 0.698874 0.698874Z" fill="#363A45"/>
                                </svg>
                            </span>
                        </li>
                    </ul>
                    <button v-if="answerCount.length < 4" @click="answerCount.push([])">Antwortmöglichkeit hinzufügen</button>
                </div>
            </form>

            <div v-if="poll != null" class="pollCreatePopover_content">
                <p>Umfrageergebnisse</p>
                <div>
                    <p>{{ poll.question }}</p>
                </div>
                <div>
                    <p>{{ poll.responses[0].length + poll.responses[1].length + poll.responses[2].length + poll.responses[3].length}} Stimme(n) bisher</p>
                    <ul>
                        <li v-for="(answer, key) in poll.answers" :key="key">
                            <span>{{ answer }}</span>
                            <span>{{ poll.responses[key]?.length }}</span>
                        </li>
                    </ul>
                </div>
                <div v-if="pollState == 'closed'">
                    <button @click="sharePollResults">
                        Ergebnis im Chat teilen
                    </button>
                </div>
            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket";
import { useStore } from "~/store";

const store = useStore();
const route = useRoute();
const roomId = route.params.roomId;

let wsProvider: WebsocketProvider;
const doc = new Y.Doc();
let poll = ref(null);
let pollSharedArray = doc.getArray("poll");
let showPopover = ref(false);

const pollContent = ref(null);
let pollState = ref('none');
const answerCount = ref([[], []]);

const emit = defineEmits(["closePollOverlay", "sharePollResults"])

function startPoll() {

    let formData = new FormData(pollContent.value) 

    let question = formData.get("question");
    let answers = []

    if (question != null && question.trim() != "") {

        for (let i = 0; i <= 4; i++) {
            let answer = formData.get("answer[x]".replace("x", i.toString()));
            answer != null && answer.trim() != "" ? answers.push(answer) : null;
        }

        if (answers.length > 1) {

            let pollConstructor = new Y.Map();
            let responsesConstructor = new Y.Array();

            pollConstructor.set("initiator", store.session.email);
            pollConstructor.set("question", question);
            pollConstructor.set("answers", answers);
            pollConstructor.set("responses", responsesConstructor);

            for (let n = 0; n < answers.length; n++) {
                let response = new Y.Array();
                responsesConstructor.push([response]);
            }

            pollSharedArray.push([pollConstructor]);
            answerCount.value = [[], []];
        }
    }
}

function closePoll() {
    pollSharedArray.delete(0, 1);
    pollState.value = "closed";
}

function sharePollResults() {
    emit("sharePollResults", {...poll.value});
}

onMounted(() => {
    wsProvider = new WebsocketProvider("ws://"+ window.location.hostname +":1234", "room/" + roomId + '/poll' , doc);

    pollSharedArray.observe(event => {

        for(let value of event.changes.added) {

            poll.value = {
                initiator: pollSharedArray.get(0).get("initiator"),
                question: pollSharedArray.get(0).get("question"),
                answers: pollSharedArray.get(0).get("answers"),
                responses: [[], [], [], []],
                votes: [],
            }; 

            for (let n = 0; n < pollSharedArray.get(0).get("responses").length; n++) {

                pollSharedArray.get(0).get("responses").get(n).observe(event => {

                    for(let value of event.changes.added) {
                        if (!poll.value.votes.includes(value.content.arr[0])) {

                            poll.value.responses[n].push(value.content.arr[0]);
                            poll.value.votes.push(value.content.arr[0]);
                        }
                    }
                })
            }

            pollState.value = "open";
        }

        for(let value of event.changes.deleted) {
            pollState.value = "closed";
        }
    })

    window.onbeforeunload = function () {
        wsProvider.disconnect();
    }
})
</script>

<style>
#pollCreateOverlay > button {
    width: 100%;
    height: 46px;
    border: none;
    border-radius: 6px;
    background: linear-gradient(135deg, rgba(121,240,218,1) 0%, rgba(59,86,149,1) 100%);
    font-weight: 600;
    font-size: .9rem;
    color: #ffffff;
    cursor: pointer;
}

#pollCreatePopover {
    box-sizing: border-box;
    position: absolute;
    bottom: 66px;
    width: 100%;
    padding: 20px;
    background-color: #252830;
    border-radius: 10px;
    filter: drop-shadow(0 0 8px #252830);
    z-index: 1;
}

#pollCreatePopover::before {
    box-sizing: border-box;
    content: '';
    position: absolute;
    bottom: -14px;
    left: calc(50%);
    width: 20px;
    height: 20px;
    transform: rotate(45deg) translateX(-50%);
    border: 10px solid #252830;
    z-index: -1;
}

#pollCreatePopover > button {
    box-sizing: border-box;
    position: absolute;
    right: 20px;
    top: 20px;
    padding: 0;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
}

#pollCreatePopover > button svg {
    stroke: #252830;
    stroke-width: 2px;
}

.pollCreatePopover_content > p {
    margin: 6px 0 0 6px;
    padding-bottom: 10px;
    font-weight: 700;
    font-size: 1.2rem;
}

.pollCreatePopover_content div {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    padding: 14px;
    background-color: #363A45;
    border-radius: 10px;
}

.pollCreatePopover_content ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
}

.pollCreatePopover_content button {
    height: 32px;
    border-radius: 6px;
    outline: none;
    border: 1px solid #ffffff;
    background-color: transparent;
    font-weight: 700;
    color: #ffffff;
    cursor: pointer;
}

.pollCreatePopover_content ul li:not(:first-child) {
    margin-top: 10px;
}

#pollCreatePopover form label {
    color: #ffffff;
    margin-bottom: 10px;
    padding-left: 4px;
    font-size: .9rem;
}

#pollCreatePopover form input {
    box-sizing: border-box;
    height: 32px;
    width: 100%;
    padding: 4px 10px;
    outline: none;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    background-color: #ffffff;
}

#pollCreatePopover form input::placeholder {
    color: #d13a49;
}

#pollCreatePopover form ul li {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
}

#pollCreatePopover form ul li input{
    padding-right: 32px;
    font-weight: 500;
}

#pollCreatePopover form ul span {
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 30px;
    padding: 10px;
    cursor: pointer;
}

#pollCreatePopover form button {
    margin-top: 10px;
}

#pollCreatePopover > div > div p {
    margin: 0;
    padding: 0;
    color: #ffffff;
}

#pollCreatePopover > div > div:first-of-type p {
    font-weight: 600;
    text-align: center;
}

#pollCreatePopover > div > div:nth-of-type(2) p {
    margin: 6px 0 16px 0;
}

#pollCreatePopover > div ul li {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    min-height: 32px;
    width: 100%;
    padding: 4px 10px;
    border-radius: 6px;
    background-color: #ffffff;
    color: #000000;
}
</style>