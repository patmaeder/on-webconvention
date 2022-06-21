<template>
    <div id="eventSite">
        <div id="eventSite__controls">
            <NuxtLink to="/" @click="leaveEvent">
                <div>
                    <span>
                        {{ `0${new Date(expo.startDate).getDate()}`.slice(-2) }}.{{ `0${new Date(expo.startDate).getMonth() + 1}`.slice(-2) }} -
                        {{ `0${new Date(expo.endDate).getDate()}`.slice(-2) }}.{{ `0${new Date(expo.endDate).getMonth() + 1}`.slice(-2) }}
                    </span>
                    <p>{{ expo.name }}</p>
                </div>
                <div>
                    <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.2129 9.18164L26.0002 13.7271L22.2129 9.18164ZM22.2129 18.2726L26.0002 13.7271L22.2129 18.2726Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M1 1V26.4548M23.7275 13.7274H11.9092H23.7275ZM1 1H17.3638H1ZM1 26.4548H17.3638H1ZM17.3638 1V8.27281V1ZM17.3638 19.182V26.4548V19.182Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            </NuxtLink>

            <NuxtLink :to="`/room/${currentRoom}`" v-if="currentRoom != null">
                {{ eventSite.find(elem => elem.id == currentRoom).name }} <br />beitreten
            </NuxtLink>
        </div>
        <EventSiteRenderer 
            ref="eventSiteRenderer"
            :eventSite="eventSite"
            :user="user"
            :events="events"
            :favorites="favoriteEvents"
            @favorEvent="favor"
            @enterRoom="joinRoom"
        />
        <Calendar :events="events" :favorites="favoriteEvents" :roomNames="eventSite.reduce((obj, item) => Object.assign(obj, {[item.id]: item.name }))" @favorEvent="favor"/>
    </div>
</template>

<script lang="ts" setup>

definePageMeta({ layout: "no-header", middleware: "auth" });

const route = useRoute()
const user = {
    id: route.query.id,
    role: route.query.role
}
const { data: expo } = await useAsyncData('fetch.expo', () => $fetch('/api/expo'))
const { data: eventSite } = await useAsyncData('fetch.eventRooms', () => $fetch('/api/expo/eventRooms'))
const { data: events } = await useAsyncData('fetch.events', () => $fetch('/api/expo/events'))
 
let favoriteEvents = ref([]);

let currentRoom = ref(null);

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

function joinRoom(roomID) {

    currentRoom.value = null;

    if (roomID != null) {
        const roomType = eventSite.value.find(elem => elem.id == roomID).type;

        if (roomType == "keynote") {
            const currentTimestamp = new Date().getTime()

            let filteredEvents = events.value.filter((elem) => {
                return elem.room == roomID &&
                    new Date(elem.endDate).getTime() > currentTimestamp &&
                    new Date(elem.startDate).getTime() < currentTimestamp
            });

            filteredEvents.length > 0 ? currentRoom.value = roomID : null;

        } else if (roomType == "break") {
            currentRoom.value = roomID
        }
    }
}

function leaveEvent() {
    eventSiteRenderer.value.removeCharacter();
    navigateTo('/logout')
}
</script>

<style lang="scss">
#eventSite {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #252830;

    &__controls {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        gap: 12px;
        padding: 26px;
        z-index: 10;

        & > a {
            padding: 18px 26px;
            border: none;
            border-radius: 10px;
            box-shadow: 2px 4px 4px rgba(0, 0, 0, .25);
            cursor: pointer;
            text-decoration: none;
        }
    
        & > a:first-child {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: clamp(360px, 30vw, 460px);
            background-color: #363A45;


            & div:first-child {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                color: #ffffff;

                & p {
                    margin: 0;
                    font-weight: 600;
                    font-size: 1.1rem;
                }

                & span {
                    margin-bottom: 6px;
                    font-weight: 400;
                    font-size: .9rem;
                }
            }
        }

        & > a:nth-child(2) {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 160px;
            background: linear-gradient(150deg, rgba(121,220,240,1) 0%, rgba(59,86,149,1) 100%);
            font-size: 1rem;
            font-weight: 600;
            line-height: 120%;
            color: #ffffff;
            text-align: center;
        }
    }
}
</style>