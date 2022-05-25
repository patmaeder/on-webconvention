<template>
    <div id="eventSite">
        <EventSiteRenderer ref="eventSiteRenderer" :eventSite="eventSite" :user="user" />
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
        }
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
</script>

<style>
#eventSite {
    width: 100vw;
    height: 100vh;
    background-color: #252830;
}
</style>