<template>
    <div id="eventSite">
        <div>
            <button @click="leaveEvent">Event verlassen</button>
        </div>
        <EventSiteRenderer 
            ref="eventSiteRenderer"
            :eventSite="eventSite" 
            :user="user" 
            :events="events" 
            :favorites="favoriteEvents" 
            @favorEvent="favor" 
        />
    </div>
</template>

<script lang="ts" setup>

const route = useRoute()

const user = {
    id: route.query.user,
    role: "visitor"
}

const eventSite = {
   500000: {
        id: 500000,
        name: 'Empfangsbereich',
        type: "lobby",
        src: "lobby.glb",
        position: {
            x: 0,
            y: 0,
            z: 0.5
        },
   },
   500001: {
        id: 500001,
        name: 'Meetingraum 1',
        type: "keynote",
        src: "keynote.glb",
        position: {
            x: 1,
            y: 0,
            z: 0
        },
    }, 
    500002: {
        id: 500002,
        name: 'Meetingraum 2',
        type: "keynote",
        src: "keynote.glb",
        position: {
            x: 1,
            y: 0,
            z: 1
        },
    }, 
    500003: {
        id: 500003,
        name: 'Pausenraum',
        type: "break",
        src: "break.glb",
        position: {
            x: 0,
            y: 0,
            z: -1
        },
    },
}

const events = {
    100000: {
        name: "Ein zu frühes Event",
        start_date: "05-20-2022 15:00:00",
        end_date: "05-20-2022 15:45:00",
        room: 500001
    },
    100001: {
        name: "Ein Event",
        start_date: "05-25-2022 15:00:00",
        end_date: "05-25-2022 16:30:00",
        room: 500001
    },
    100002: {
        name: "Nächstes Event",
        start_date: "05-26-2022 16:00:00",
        end_date: "05-26-2022 16:30:00",
        room: 500001
    },
    100003: {
        name: "Ein Event im anderen Raum",
        start_date: "05-26-2022 14:00:00",
        end_date: "05-26-2022 16:00:00",
        room: 500002
    }
}

let favoriteEvents = ref([]);

const eventSiteRenderer = ref(null);

function favor(eventID) {
    if (favoriteEvents.value.includes(eventID)) {
        favoriteEvents.value = favoriteEvents.value.filter((elem) => {
            return elem != eventID
        })

    } else {
        favoriteEvents.value.push(eventID)
    }
}

function leaveEvent() {
    eventSiteRenderer.value.removeCharacter();
    window.location.pathname = "/";
}
</script>

<style>
#eventSite {
    width: 100vw;
    height: 100vh;
    background-color: #252830;
}
</style>