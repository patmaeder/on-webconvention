<template>
    <div>
        <div id="sidebar">
            <div>
                <Chat ref="chat" :roomId="roomId" :user="user" />
            </div>
            <PollCreateOverlay v-if="user.role == 'speaker'" :roomId="roomId" :user="user" @sharePollResults="sharePollResults" />
        </div>
        <PollVoteOverlay v-if="user.role == 'user'" :roomId="roomId" :user="user" />
    </div>
</template>

<script lang="ts" setup>

definePageMeta({ middleware: "auth" });

const route = useRoute();
const roomId = route.params.id;
const user = {
    id: route.query.id,
    role: route.query.role,
    name: route.query.name,
}
const chat = ref(null);

function sharePollResults(event) {
    chat.value.sendMessage('pollResults', event)
}

</script>

<style>
#sidebar {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    width: 450px;
    height: 100vh;
    padding: 40px;
    background-color: #363A45;
    border-radius: 40px 0 0 40px;
}

#sidebar > div:first-of-type {
    flex-grow: 1;
    min-height: 0;
}

#sidebar > div:last-child {
    position: relative;
    margin-top: 20px;
}

#pollOverlay {
    position: absolute;
    bottom: 0;
    right: 0;
}
</style>