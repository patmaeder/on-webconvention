<template>
    <div id="event-site_wrapper" ref="eventSiteWrapper">
        <client-only>
            <Renderer ref="renderer" alpha antialias orbitCtrl resize="true" :pointer="{intersectRecursive: true}">
                <Camera ref="camera" :position="{x: -10, y: 6, z: 8}" />
                <Scene ref="scene">
                    <PointLight :position="{x: -8, y: 10, z: 4 }" :intensity="1.4"/>
                    <GltfModel v-for="tile in eventSite" :key="tile.id" :src="'/glbModels/' + tile.src" :position="tile.position" @click="focusRoom(tile.id, $event)" />
                
                    <!-- Render Character if user moves -->
                    <GltfModel 
                        v-if="showChar" 
                        ref="character" 
                        :src="user.role == 'visitor' ?  '/glbModels/visitor.glb' : '/glbModels/speaker.glb'" 
                        :position="usersSharedMap.has(props.user.id) ? {...usersSharedMap.get(props.user.id).position} : {x: 0, y: 0.05, z: 0}"
                        :rotation="usersSharedMap.has(props.user.id) ? {x: usersSharedMap.get(props.user.id).rotation._x, y: usersSharedMap.get(props.user.id).rotation._y, z: usersSharedMap.get(props.user.id).rotation._z} : {x: 0, y: 0, z: 0}"
                        :scale="{x: 0.4, y: 0.4, z: 0.4}" 
                        @load="characterLoaded"
                    />
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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket";

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
const character = ref(null);
let characterObject3D: THREE.Object3D;

// Variables needed for showing popover
const eventSiteOverlay = ref(null);
const popover = ref(null);
let popoverCSS2DObject: CSS2DObject;
let selectedRoom = ref(null);

// Variables related to character movement
let clock: THREE.Clock;
let delta;
let showChar = ref(false);
const rotateAngle: THREE.Vector3 = {x: 0, y: 1, z: 0};

// Variables needed for websocket connection
let wsProvider: WebsocketProvider;
const doc = new Y.Doc();
let users = {};
const usersSharedMap = doc.getMap("users");

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
    let temp = [];
    const time = new Date().getTime();

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
function characterLoaded(gltf) {
    characterObject3D = gltf.scene;

    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);

    // Add user to sharedMap
    if (!usersSharedMap.has(props.user.id)) {
        usersSharedMap.set(props.user.id, {
            role: props.user.role,
            position: {x: 0, y: 0.05, z: 0},
            rotation: {_x: 0, _y: 0, _z: 0},
        })
    }

    // Callback that is executed before every rerender to move characters
    renderer.value.onBeforeRender(() => {

        if (character.value.userData.move) {

            if (character.value.userData.move.forward != 0 || character.value.userData.move.sideward != 0) {
                
                if (character.value.userData.move.speed < 10) {
                    character.value.userData.move.speed += (Math.log(character.value.userData.move.speed) * -1 + 2.5) * 0.1;
                }

                moveCharacter(characterObject3D, character.value.userData.move.forward, character.value.userData.move.sideward, character.value.userData.move.speed, delta);

                usersSharedMap.set(props.user.id, {
                    role: props.user.role,
                    position: characterObject3D.position,
                    rotation: characterObject3D.rotation
                })
            }
        }
    })
}

function moveCharacter(model, forward, sideward, speed) {

    let rotateQuaternion: THREE.Quaternion = new THREE.Quaternion();
    let angle = 0;

    switch(true) {
        case (forward == -1 && sideward == -1):
            angle = 0.25 * Math.PI;
            break;
        case (forward == -1 && sideward == 1):
            angle = -0.25 * Math.PI;
            break;
        case (forward == -1):
            angle = 0;
            break;
        case (forward == 1 && sideward == -1):
            angle = 0.75 * Math.PI;
            break;
        case (forward == 1 && sideward == 1): 
            angle = -0.75 * Math.PI;
            break;
        case (forward == 1):
            angle = Math.PI;
            break;
        case (sideward == -1):
            angle = 0.5 * Math.PI;
            break;
        case (sideward == 1):
            angle = -0.5 * Math.PI;
            break;
    }

    rotateQuaternion.setFromAxisAngle(rotateAngle, angle);
    model.quaternion.rotateTowards(rotateQuaternion, 0.04);
    model.translateX(0.02 * delta * speed);
}

function keyDown(evt) {

    let forward = (character.value.userData.move !== undefined) ? character.value.userData.move.forward : 0;
    let sideward = (character.value.userData.move !== undefined) ?  character.value.userData.move.sideward : 0;
    
    switch(evt.keyCode){
        case 87: //W
        case 38: //Arrow up
            forward = -1;
            setDirectionOfMovement(forward, sideward);
            break;
        case 83: //S
        case 40: //Arrow down
            forward = 1;
            setDirectionOfMovement(forward, sideward);
            break;
        case 65: //A
        case 37: //Arrow left
            sideward = -1;
            setDirectionOfMovement(forward, sideward);
            break;
        case 68: //D
        case 39: //Arrow right
            sideward = 1;
            setDirectionOfMovement(forward, sideward);
            break;
    }
}
  
function keyUp(evt){
    let forward = (character.value.userData.move !== undefined) ? character.value.userData.move.forward : 0;
    let sideward = (character.value.userData.move !== undefined) ?  character.value.userData.move.sideward : 0;
    
    switch(evt.keyCode){
      case 87: //W
      case 38: //Arrow up
      case 83: //S
      case 40: //Arrow down
        forward = 0;
        setDirectionOfMovement(forward, sideward);
        break;
      case 65: //A
      case 37: //Arrow left
      case 68: //D
      case 39: //Arrow right
        sideward = 0;
        setDirectionOfMovement(forward, sideward);
        break;
    }
}

function setDirectionOfMovement(forward, sideward){

    if (character.value.userData.move && (forward != 0 || sideward != 0)){
        character.value.userData.move.forward = forward;
        character.value.userData.move.sideward = sideward;

    } else {
        character.value.userData.move = { forward, sideward, speed: 1 };
    }
}

function addUser(key, user) {
    const loader = new GLTFLoader();
    const src = user.role == "visitor" ? "/glbModels/visitor.glb" : "/glbModels/speaker.glb";

    loader.load(
        src,
        function (gltf) {
            scene.value.add(gltf.scene);

            gltf.scene.position.set(user.position.x, user.position.y, user.position.z);
            gltf.scene.scale.set(0.4, 0.4, 0.4)
            gltf.scene.rotation.set(user.rotation._x, user.rotation._y, user.rotation._z)
            
            users[key] = {
                model: gltf.scene,
                ...user
            }
        },
    );
}

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

        // Setup Clock for animation
        clock = new THREE.Clock();

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

        // EventListener to render character on user input
        document.addEventListener("keydown", function listenForCharInput (event) {
            [87, 38, 83, 40, 65, 37, 68, 39].includes(event.keyCode) ? showChar.value = true : null;
        }, {once: true})

        // Establish Websocket connection and listen for changes
        wsProvider = new WebsocketProvider("ws://"+ window.location.hostname +":1234", "event-site", doc);

        usersSharedMap.observe(event => {
            for(let [key, value] of event.changes.keys) {

                switch (value.action) {

                    case "add":
                        if (key != props.user.id) {
                            addUser(key, usersSharedMap.get(key));

                        } else if (!showChar.value) {
                            showChar.value = true;
                        }
                        break;
                    
                    case "update":
                        if (key != props.user.id) {
                            users[key] = {
                                ...users[key],
                                ...usersSharedMap.get(key)
                            }
                        }
                        break;

                    case "delete":
                        if (key != props.user.id) {
                            scene.value.remove(users[key].character);
                            delete users[key];
                        }
                        break;
                }
            }
        })

        renderer.value.onBeforeRender(() => {
            delta = clock.getDelta();
            labelRenderer.render(renderer.value.scene, renderer.value.camera);
            popoverCSS2DObject.position.set(0, (renderer.value.three.cameraCtrl.getDistance() * 0.048 + 0.12), 0);
        
            for (let [key, user] of Object.entries(users)) {

                user.model.rotation.set(user.rotation._x,user.rotation._y, user.rotation._z);
                user.model.position.lerp(user.position, 0.5)
            }
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

#event-site_overlay .favorite {
    color: #79F0DA;
}
</style>
