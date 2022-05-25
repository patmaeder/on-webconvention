<template>
    <div id="event-site_wrapper" ref="eventSiteWrapper">
        <client-only>
            <Renderer ref="renderer" alpha antialias orbitCtrl resize="true" :pointer="{intersectRecursive: true}">
                <Camera ref="camera" :position="{x: -10, y: 6, z: 8}" />
                <Scene ref="scene">
                    <PointLight :position="{x: -8, y: 10, z: 4 }" :intensity="1.4"/>
                    <GltfModel v-for="tile in eventSite" :key="tile.id" :src="'/glbModels/' + tile.src" :position="tile.position" @click="focusRoom(tile.id, $event)" />
                </Scene>
            </Renderer>
        </client-only>
        <div id="event-site_overlay" ref="eventSiteOverlay" >
            <div ref="popover">
                <div v-if="selectedRoom != null">
                    <span>{{ eventSite[selectedRoom].name }}</span>
                    <button @click="blurRoom">
                        X
                    </button>
                    <ul>
                        <li v-for="event in currentEvents" :key="event.id" :class="{'favorite': favorites.includes(event.id)}">
                            <span>{{ new Date(events[event.id].start_date).toLocaleTimeString("de-DE").slice(0, -3) }}</span>
                            <span>{{ events[event.id].name }}</span>
                            <span @click="$emit('favorEvent', event.id)">O</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Renderer, Camera, Scene, PointLight, GltfModel } from "troisjs";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

/*
 * ---------------
 * Variables
 * ---------------
 */

// References to Scene Objects
const eventSiteWrapper = ref(null);
const renderer = ref(null);
let labelRenderer: CSS2DRenderer;
const camera = ref(null);
const scene = ref(null);

// Variables needed for showing popover
const eventSiteOverlay = ref(null);
const popover = ref(null);
let popoverCSS2DObject: CSS2DObject;
let selectedRoom = ref(null);


/*
 * ---------------
 * Props
 * ---------------
 */
const props = defineProps({
    eventSite: Object,
    user: Object,
    events: Object,
    favorites: Array,
})


/*
 * ---------------
 * Events
 * ---------------
 */
const emit = defineEmits(["favorEvent"])


/*
 * ---------------
 * Computed
 * ---------------
 */
const currentEvents = computed(() => {
    let temp = []
    const time = new Date().getTime()

    for (let [key, value] of Object.entries(props.events)) {
        value.room == selectedRoom.value && new Date(value.end_date).getTime() > time ? temp.push({id: key, ...value}): null;
    }

    temp.sort((a, b) => {
        return new Date(a.start_date).getTime() < new Date(b.start_date).getTime() ? -1 : 1;
    })
    
    return temp.slice(0, 2);
})


/*
 * ---------------
 * Functions
 * ---------------
 */
function focusRoom(roomID, event) {

    if (selectedRoom.value != null) {
        event.component.remove(popoverCSS2DObject);
    }

    selectedRoom.value = roomID;
    event.component.add(popoverCSS2DObject);
}

function blurRoom() {
    selectedRoom.value = null;
    popoverCSS2DObject.parent.remove(popoverCSS2DObject);
}


/*
 * ---------------
 * On Mounted Hook
 * --------------
 */
onMounted(() => {
    nextTick(() => {

        // Adjust default Three.js Orbitcontrol Properties
        const controls = renderer.value.three.cameraCtrl;
        controls.enableRotate = false;
        controls.minDistance = 1;
        controls.maxDistance = 14;
        controls.mouseButtons = {LEFT: 2, MIDDLE: 1, RIGHT: 0};
        controls.screenSpacePanning = false;

        // Setup CSS2DObject and CSS2DRenderer
        popoverCSS2DObject = new CSS2DObject(popover.value)
        labelRenderer = new CSS2DRenderer({element: eventSiteOverlay.value});
        labelRenderer.setSize(eventSiteWrapper.value.clientWidth, eventSiteWrapper.value.clientHeight);

        window.addEventListener("resize", (() => {
            labelRenderer.setSize(eventSiteWrapper.value.clientWidth, eventSiteWrapper.value.clientHeight);
        }))

        renderer.value.onBeforeRender(() => {
            labelRenderer.render(renderer.value.scene, renderer.value.camera);
            popoverCSS2DObject.position.set(0, (renderer.value.three.cameraCtrl.getDistance() * 0.048 + 0.12), 0);
        })
    })
})
</script>

<style>
#event-site_wrapper {
    width: 100%;
    height: 100%;
}

#event-site_overlay {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    touch-action: none;
    pointer-events: none;
}

#event-site_overlay > div > div {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    pointer-events: all;
    background-color: #363A45;
    color: #ffffff;
    border-radius: 10px;
    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, .25));
}

#event-site_overlay > div > div::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: calc(50% - 8px);
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
    background-color: inherit;
}

#event-site_overlay > div > div span {
    text-align: center;
    padding: 0 40px;
}

#event-site_overlay > div > div button {
    position: absolute;
    top: 10px;
    right: 10px;
}

#event-site_overlay ul {
    list-style-type: none;
    padding: 0;
}

#event-site_overlay li {
    display: grid;
    grid-template-columns: 60px 1fr 40px;
    justify-items: center;
}

#event-site_overlay .favorite{
    color: #79F0DA;
}
</style>
