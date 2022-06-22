<template>
    <div id="chat">
        <div ref="chatMessages">
            <ul>
                <li v-for="(message, key) in messages" :key="key">
                    <div v-if="message.type == 'userMessage'" class="userMessage">
                        <p>
                            <svg v-if="message.user.role == 'speaker'" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 16.25a3.25 3.25 0 0 1-3.25 3.25h-7.5A3.25 3.25 0 0 1 2 16.25v-8.5A3.25 3.25 0 0 1 5.25 4.5h7.5A3.25 3.25 0 0 1 16 7.75v8.5Zm5.762-10.357a1 1 0 0 1 .238.648v10.918a1 1 0 0 1-1.648.762L17 15.37V8.628l3.352-2.849a1 1 0 0 1 1.41.114Z" fill="#ffffff"/>
                            </svg>
                            {{ message.user.name }}
                        </p>
                        <p>{{ message.content }}</p>
                    </div>
                    <div v-if="message.type == 'pollResults'" class="pollResults">
                        <p>{{ message.content.question }}</p>
                        <ul>
                            <li v-for="(answer, index) in message.content.answers" :key="index">
                                <span>{{ answer }}</span>
                                <span>{{ message.content.responses[index].length }}</span>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
        <div>
            <form @submit="sendMessage('userMessage')">
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
import { useStore } from "../store";

defineExpose({
    sendMessage
})

const store = useStore();
let wsProvider: WebsocketProvider;
const doc = new Y.Doc();
let messages = ref([]);
let chatSharedMap = doc.getArray("chat");
const chatMessages = ref(null);
const chatInput = ref(null);

const props = defineProps({
    roomId: String,
})

function sendMessage(type, content = chatInput.value.textContent) {
    event.preventDefault();

    if (content != "") {

        type == "userMessage" ? chatInput.value.textContent = "" : null;
        
        chatSharedMap.push([{
            type,
            user: {
                name: store.session.email,
                role: store.session.role,
            },
            content,
        }])
    }
}

onMounted(() => {
    wsProvider = new WebsocketProvider("ws://"+ window.location.hostname +":1234", "room/" + props.roomId + '/chat' , doc);

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
        event.keyCode == 13 && document.activeElement == chatInput.value ? sendMessage("userMessage") : null;
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

#chat ul li div {
    padding: 0 12px;
}

#chat ul li p,
#chat ul li span {
    margin: 0;
    color: #ffffff;
}

#chat .userMessage svg {
    box-sizing: border-box;
    margin-right: 4px;
    padding: 2px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: #51b4a2;
    transform: translateY(4px);
}

#chat .userMessage p:first-child {
    margin-bottom: 10px;
    font-weight: 700;
}

#chat .userMessage p:nth-child(2) {
    line-height: 160%;
}

#chat .pollResults {
    padding: 20px;
    background-color: #31353f;
}

#chat .pollResults > p {
    text-align: center;
    margin-bottom: 16px;
    font-weight: 700;
}

#chat .pollResults ul li  {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

#chat .pollResults ul li:not(:first-child)  {
    margin-top: 16px;
}

#chat .pollResults ul li span:nth-child(2)  {
    margin-left: 20px;
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