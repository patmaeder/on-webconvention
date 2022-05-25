<template>
    <div id="event-site_wrapper" ref="eventSiteWrapper">
        <client-only>
            <Renderer ref="renderer" alpha antialias orbitCtrl resize="true" :pointer="{intersectRecursive: true}">
                <Camera ref="camera" :position="{x: -10, y: 6, z: 8}" />
                <Scene ref="scene">
                    <PointLight :position="{x: -8, y: 10, z: 4 }" :intensity="1.4"/>
                    <GltfModel v-for="tile in eventSite" :key="tile.id" :src="'/glbModels/' + tile.src" :position="tile.position" />                            
                </Scene>
            </Renderer>
        </client-only>
    </div>
</template>

<script lang="ts" setup>
import { Renderer, Camera, Scene, PointLight, GltfModel } from "troisjs";


/*
 * ---------------
 * Variables
 * ---------------
 */

// References to Scene Objects
const eventSiteWrapper = ref(null);
const renderer = ref(null);
const camera = ref(null);
const scene = ref(null);


/*
 * ---------------
 * Props
 * ---------------
 */
const props = defineProps({
    eventSite: Object,
    user: Object,
})


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
    })
})
</script>

<style>
#event-site_wrapper {
    width: 100%;
    height: 100%;
}
</style>
