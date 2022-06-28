<template>
    <div id="eventSite__wrapper" ref="eventSiteWrapper">
        <client-only>
            <Renderer ref="renderer" alpha antialias orbitCtrl resize="window" :pointer="{intersectRecursive: true}">
                <Camera ref="camera" :position="{x: -3, y: 1.32, z: 2.4}" />
                <Scene ref="scene">
                    <AmbientLight :intensity=".8" />
                    <DirectionalLight
                        ref="directionalLight1" 
                        :position="{x: -10, y: 10, z: 6}"
                        :intensity=".6"
                        :shadowMapSize="{width: 4096, height: 4096}"
                        :castShadow="true" 
                    />
                    <DirectionalLight
                        ref="directionalLight2" 
                        :position="{x: 0, y: 10, z: 0}"
                        :intensity=".3"
                        :shadowMapSize="{width: 4096, height: 4096}"
                        :castShadow="true" 
                    />

                    <Group ref="tiles">
                        <GltfModel 
                            v-for="tile in eventSite" 
                            :key="tile.id" :src="'/glbModels/' + tile.type + '.glb'" 
                            :position="{x: tile.positionX, y: tile.positionY, z: tile.positionZ}" 
                            @click="focusRoom($event, tile.id)" 
                                @before-load="beforeTileLoad"
                            @load="tileLoaded($event, tile.id)"
                        />
                    </Group>
                    
                    <!-- Render Character if user moves -->
                    <GltfModel
                        v-if="showCharacter" 
                        ref="character" 
                        :src="user.role == 'speaker' ? '/glbModels/speaker.glb' : '/glbModels/visitor.glb'" 
                        :position="usersSharedMap.has(props.user.id) ? {...usersSharedMap.get(props.user.id).position} : {x: -0.3, y: 0.03, z: 0.44}"
                        :rotation="usersSharedMap.has(props.user.id) ? {x: usersSharedMap.get(props.user.id).rotation._x, y: usersSharedMap.get(props.user.id).rotation._y, z: usersSharedMap.get(props.user.id).rotation._z} : {x: 0, y: 0, z: 0}"
                        :scale="{x: 0.5, y: 0.5, z: 0.5}"
                        @load="characterLoaded"
                    />

                </Scene>
            </Renderer>
        </client-only>
        <div id="eventSite__overlay" ref="eventSiteOverlay" >
            <div ref="popover">
               <div v-if="currentEvents.length > 0">
                    <span>{{ eventSite.find(elem => elem.id == selectedRoom).name }}</span>
                    <button @click="blurRoom">
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.698874 0.698874C1.1465 0.251385 1.75353 0 2.38647 0C3.01941 0 3.62644 0.251385 4.07406 0.698874L12.5144 9.13923L20.9548 0.698874C21.405 0.264067 22.0079 0.0234734 22.6338 0.028912C23.2596 0.0343505 23.8583 0.285386 24.3009 0.727951C24.7434 1.17052 24.9945 1.7692 24.9999 2.39506C25.0053 3.02092 24.7648 3.62387 24.3299 4.07406L15.8896 12.5144L24.3299 20.9548C24.7648 21.405 25.0053 22.0079 24.9999 22.6338C24.9945 23.2596 24.7434 23.8583 24.3009 24.3009C23.8583 24.7434 23.2596 24.9945 22.6338 24.9999C22.0079 25.0053 21.405 24.7648 20.9548 24.3299L12.5144 15.8896L4.07406 24.3299C3.62387 24.7648 3.02092 25.0053 2.39506 24.9999C1.7692 24.9945 1.17052 24.7434 0.727951 24.3009C0.285386 23.8583 0.0343505 23.2596 0.028912 22.6338C0.0234734 22.0079 0.264067 21.405 0.698874 20.9548L9.13923 12.5144L0.698874 4.07406C0.251385 3.62644 0 3.01941 0 2.38647C0 1.75353 0.251385 1.1465 0.698874 0.698874Z"/>
                        </svg>
                    </button>
                    <ul>
                        <li 
                            v-for="event in currentEvents" 
                            :key="events.find(elem => elem.id == event).id" 
                            :class="{'favorite': favorites.includes(event), 'current': new Date(events.find(elem => elem.id == event).startDate).getTime() < new Date().getTime()}">
                            <div>
                                <span v-if="new Date(events.find(elem => elem.id == event).startDate).getTime() < new Date().getTime()">Aktuell</span>
                                <span v-else>
                                    <span>Bevorstehend</span>
                                    <span>{{ `0${new Date(events.find(elem => elem.id == event).startDate).getDate()}`.slice(-2) }}.{{ `0${new Date(events.find(elem => elem.id == event).startDate).getMonth() + 1}`.slice(-2) }}</span>
                                </span>
                                <p>
                                    <span>{{ new Date(events.find(elem => elem.id == event).startDate).toLocaleTimeString("de-DE").slice(0, -3) }}</span>
                                    <span>{{ events.find(elem => elem.id == event).name }}</span>
                                </p>
                            </div>
                            <button @click="$emit('favorEvent', event)">
                                <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"/>
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div> 
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Renderer, Camera, Scene, AmbientLight, DirectionalLight, Group, GltfModel } from "troisjs";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as Y from "yjs"
import { WebsocketProvider } from "y-websocket";

// Expose publicly available variables and functions
defineExpose({
    removeCharacter
})


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
const directionalLight1 = ref(null);
const directionalLight2 = ref(null);
const tiles = ref(null);
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
let showCharacter = ref(false);
const rotateAngle: THREE.Vector3 = {x: 0, y: 1, z: 0};
let raycaster: THREE.Raycaster;
let currentRoom;

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
    eventSite: Array,
    user: Object,
    events: Array,
    favorites: Array,
})

/*
 * ---------------
 * Events
 * ---------------
 */
const emit = defineEmits(["favorEvent", "enterRoom"])


/*
 * ---------------
 * Computed
 * ---------------
 */
const currentEvents = computed(() => {
    const currentTimestamp = new Date().getTime();

    let temp = props.events.filter((elem) => {
        return elem.roomId == selectedRoom.value && new Date(elem.endDate).getTime() > currentTimestamp
    })

    temp.sort((a, b) => {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    })
   
    return temp.slice(0, 2).map(elem => elem.id);
})


/*
 * ---------------
 * Functions
 * ---------------
 */
function beforeTileLoad(GLTFLoader) {
    const loader = new DRACOLoader();
    loader.setDecoderPath('/node_modules/three/examples/js/libs/draco/');
    GLTFLoader.setDRACOLoader(loader);
}

function tileLoaded(gltf, id) {
    gltf.scene.userData.roomID = id;

    gltf.scene.children[0].traverse((node) => {
        node.castShadow = true;
        node.receiveShadow = true;
    });

    gltf.scene.children[0].receiveShadow = true;
    gltf.scene.children[0].castShadow = false;
}

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

    raycaster = new THREE.Raycaster()

    // Callback that is executed before every rerender to move characters
    renderer.value.onBeforeRender(() => {

        if (showCharacter && character.value.userData.move) {

            if (character.value.userData.move.forward != 0 || character.value.userData.move.sideward != 0) {
                
                let quaternion = getRotationQuaternion(character.value.userData.move.forward, character.value.userData.move.sideward);
                characterObject3D.quaternion.rotateTowards(quaternion, 4 * delta);

                if (!characterIsIntersecting()) {
                
                    if (character.value.userData.move.speed < 12) {
                        character.value.userData.move.speed += (Math.log(character.value.userData.move.speed) * -1 + 2.5) * 0.1;
                    }

                    raycaster.set(characterObject3D.position, new THREE.Vector3(1, -1, 0).applyQuaternion(characterObject3D.quaternion));
                    let intersections = raycaster.intersectObjects(tiles.value.group.children);
                    let tempRoom;

                    if (intersections.length > 0) {
                        characterObject3D.translateX(0.02 * delta * character.value.userData.move.speed);
                        tempRoom = intersections[intersections.length - 1].object.parent.userData.roomID;

                    } else {
                        tempRoom = null;
                    }
                    
                    if (tempRoom != currentRoom) {
                        currentRoom = tempRoom;
                        emit("enterRoom", currentRoom)
                    }
                }

                usersSharedMap.set(props.user.id, {
                    role: props.user.role,
                    position: characterObject3D.position,
                    rotation: characterObject3D.rotation
                })
            }
        }
    })
}

// Check if the character is intersecting with world objects
function characterIsIntersecting() {

    const vectors = [
        new THREE.Vector3(0.03, 0.1, -0.03).applyQuaternion(characterObject3D.quaternion),
        new THREE.Vector3(-0.03, 0.1, 0.03).applyQuaternion(characterObject3D.quaternion),
    ]
    
    const positions = [
        new THREE.Vector3(0.03, -0.01, 0.02).applyQuaternion(characterObject3D.quaternion),
        new THREE.Vector3(0.03, -0.01, -0.02).applyQuaternion(characterObject3D.quaternion),
    ]

    for (let i = 0; i < vectors.length; i++) {

        raycaster.set(characterObject3D.position.clone().add(positions[i]), vectors[i]);
        let collisions = raycaster.intersectObjects(tiles.value.group.children);

        if (collisions.length > 0) {
            return true;   
        }
    }

    return false;
}

// Get direction the character is rotation towards
function getRotationQuaternion(forward, sideward) {

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

    return rotateQuaternion.setFromAxisAngle(rotateAngle, angle);
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

function removeCharacter() {
    showCharacter.value = false;
    usersSharedMap.delete(props.user.id);
}

function addUser(key, visitor) {

    const loader = new GLTFLoader();
    const src = visitor.role == "speaker" ? "/glbModels/speaker.glb" : "/glbModels/visitor.glb";

    loader.load(
        src,
        function(gltf) {
            scene.value.add(gltf.scene);

            gltf.scene.position.set(visitor.position.x, visitor.position.y, visitor.position.z);
            gltf.scene.scale.set(0.5, 0.5, 0.5)
            gltf.scene.rotation.set(visitor.rotation._x, visitor.rotation._y, visitor.rotation._z)

            users[key] = {
                model: gltf.scene,
                ...visitor
            }
        },
    );
}

function focusRoom(event, roomID) {

    if (selectedRoom.value != null) {
        event.component.remove(popoverCSS2DObject);
    }

    selectedRoom.value = roomID;
    event.component.add(popoverCSS2DObject);

    if (roomID != currentRoom) {
        currentRoom = roomID;
        emit("enterRoom", currentRoom)
    }
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

        // Adjust colors and shadows
        renderer.value.three.renderer.shadowMap.enabled = true;
        renderer.value.three.renderer.shadowMap.enabled = THREE.PCFSoftShadowMap;
        renderer.value.three.renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.value.three.renderer.gammaFactor = 2.2;
        directionalLight1.value.light.shadow.bias = -0.00006;
        directionalLight2.value.light.shadow.bias = -0.00006;

        // Adjust default Three.js Orbitcontrol Properties
        const controls = renderer.value.three.cameraCtrl;
        controls.enableRotate = false;
        controls.minDistance = 1;
        controls.maxDistance = 14;
        controls.mouseButtons = {LEFT: 2, MIDDLE: 1, RIGHT: 0};
        controls.screenSpacePanning = false;

        // Setup CSS2DObject and CSS2DRenderer
        popoverCSS2DObject = new CSS2DObject(popover.value);
        labelRenderer = new CSS2DRenderer({element: eventSiteOverlay.value});
        labelRenderer.setSize(eventSiteWrapper.value.clientWidth, eventSiteWrapper.value.clientHeight);

        window.addEventListener("resize", (() => {
            eventSiteWrapper.value != null ? labelRenderer.setSize(eventSiteWrapper.value.clientWidth, eventSiteWrapper.value.clientHeight) : null;
        }))

        // EventListener to render character on user input
        document.addEventListener("keydown", function listenForCharInput (event) {
            [87, 38, 83, 40, 65, 37, 68, 39].includes(event.keyCode) ? showCharacter.value = true : null;
        }, {once: true})

        const runtimeConfig = useRuntimeConfig();
        console.log(runtimeConfig.public.YJS_HOST);

        // Establish Websocket connection and listen for changes
        wsProvider = new WebsocketProvider(runtimeConfig.public.YJS_HOST, "event-site", doc);

        usersSharedMap.observe(event => {
            for(let [key, value] of event.changes.keys) {

                switch (value.action) {

                    case "add":
                        if (key != props.user.id) {
                            addUser(key, usersSharedMap.get(key));

                        } else if (!showCharacter.value) {
                            showCharacter.value = true;
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
                            scene.value.remove(users[key].model);
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
        
            for (let [key, visitor] of Object.entries(users)) {

                visitor.model.rotation.set(visitor.rotation._x,visitor.rotation._y, visitor.rotation._z);
                visitor.model.position.lerp(visitor.position, 0.5)
            }
        })
    })
})
</script>

<style lang="scss">
#eventSite__wrapper {
    width: 100%;
    height: 100%;
}

#eventSite__overlay {
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    touch-action: none;
    pointer-events: none;

    & > div > div {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 20px;
        pointer-events: all;
        background-color: #363A45;
        color: #ffffff;
        border-radius: 10px;
        transform: translateY(-38%);
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, .25));

        &::before {
            content: '';
            position: absolute;
            bottom: -10px;
            left: calc(50% - 8px);
            width: 20px;
            height: 20px;
            transform: rotate(45deg);
            background-color: inherit;
        }

        & > span {
            margin-bottom: 20px;
            padding: 0 40px;
            text-align: center;
            font-size: 1.1rem;
            font-weight: 600;
        }

        & > button {
            position: absolute;
            top: 16px;
            right: 16px;
            border: none;
            background: transparent;
            cursor: pointer;

            & svg {
                stroke: #363A45;
                stroke-width: 2px;
                fill: #ffffff;
                opacity: .5;
            }
        }

        & ul {
            list-style-type: none;
            margin: 0;
            padding: 0;

            & li {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                gap: 32px;
                padding: 10px 20px 14px 20px;
                border-radius: 6px;
                background-color: #3c404c;

                &:not(:last-child) {
                    margin-bottom: 16px;
                }

                &.current {
                    background: linear-gradient(150deg, rgba(121,220,240,1) 0%, rgba(59,86,149,1) 100%);
                }

                &.favorite {
                    & button {
                        visibility: visible;
                    }
                    
                    & button svg {
                        fill: #ffffff;
                    }
                }

                & div {
                    & > span {
                        font-size: .9rem;
                        font-weight: 400;

                        & > span:last-child {
                            margin-left: 18px;
                            opacity: .5;
                        }
                    }

                    & p {
                        margin: 0;
                        margin-top: 4px;
                        font-size: 1.1rem;

                        & span:first-child {
                            margin-right: 20px;
                            font-weight: 600;
                        }
                    }
                }

                & button {
                    visibility: hidden;
                    border: none;
                    background: transparent;
                    cursor: pointer;

                    & svg {
                        stroke: #ffffff;
                        stroke-width: 1.5px;
                        transform: translateY(2px);
                    }
                }

                &:hover button {
                    visibility: visible;
                }
            }
        }
    }
}
</style>
