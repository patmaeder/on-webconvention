<template>
    <div class="iconWrapper" :class="size">
        <img :src=source />
    </div>
</template>

<script lang="ts" setup>

/*
 * ---------------
 * Props
 * ---------------
 */
const props = defineProps({
    size: String,
    source: String,
})

</script>


<style lang="scss" scoped>

    .iconWrapper {

        background-color: #FFFFFF;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        
        img {
            align-self: center;
        }
    }

    .medium {
        width: 52px;
        height: 52px;

        img {
            height: 40%;
        }
    }

    .large {
        width: 80px;
        height: 80px;

        img {
            height: 40%;
        }
    }

</style>