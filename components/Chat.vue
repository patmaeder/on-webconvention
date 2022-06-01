<template>
    <div id="chat">
        <div ref="chatMessages">
            <ul>
                <li v-for="(message, key) in messages" :key="key" :class="{'highlighted': message.user.role != 'user'}">
                    <p>{{ message.user.name }}</p>
                    <p>{{ message.content }}</p>
                </li>
            </ul>
        </div>
        <div>
            <form @submit="sendMessage">
                <span ref="chatInput" contenteditable></span>
                <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#79F0DA" class="bi bi-chevron-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket";

let wsProvider: WebsocketProvider;
const doc = new Y.Doc();
let messages = ref([]);
let chatSharedMap = doc.getArray("chat");
const chatMessages = ref(null);
const chatInput = ref(null);

const props = defineProps({
    roomID: String,
    user: Object
})

function sendMessage() {
    event.preventDefault();

    if (chatInput.value.textContent != "") {

        chatSharedMap.push([{
            user: {
                name: props.user.name,
                role: props.user.role
            },
            content: chatInput.value.textContent,
        }])

        chatInput.value.textContent = "";
    }
}

onMounted(() => {
    wsProvider = new WebsocketProvider("ws://"+ window.location.hostname +":1234", "room/" + props.roomID + '/chat3' , doc);

    chatSharedMap.observe(event => {

        for(let value of event.changes.added) {
            messages.value.push(...value.content.arr);
        }

        nextTick(() => {
            chatMessages.value.scrollTo({
                top: chatMessages.value.scrollHeight,
                left: 0,
                behavior: 'smooth'
            })
        })
    })

    document.addEventListener("keydown", (event) => {
        event.keyCode == 13 && document.activeElement == chatInput.value ? sendMessage() : null;
    })

    window.onbeforeunload = function () {
        wsProvider.disconnect();
    }
})
</script>

<style>
#chat {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    height: 100%;
    max-width: 360px;
    width: 100%;
}

#chat > div:first-child {
    flex-grow: 1;
    overflow: auto;
    margin-bottom: 20px;
}

#chat ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

#chat ul li:not(:first-child) {
    margin-top: 24px;
}

#chat ul li {
    padding: 0 12px;
}

#chat ul .highlighted {
    border-left: 4px solid #79F0DA;    
}

#chat ul li p {
    margin: 0;
    color: #ffffff;
}

#chat ul li p:first-child {
    margin-bottom: 10px;
    font-weight: 700;
}

#chat > div:last-child {
    height: fit-content;
}

#chat form {
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: #252830;
    border-radius: 10px; 
    overflow: hidden; 
}

#chat form span {
    flex-grow: 1;
    width: calc(100% - 50px);
    padding: 14px;
    background-color: transparent;
    border: none;
    outline: none;
    color: #ffffff;
}

#chat form button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 100%;
    padding: 0;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
}
</style>