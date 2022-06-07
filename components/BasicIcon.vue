<template>
    <div class="iconWrapper">
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
    source: String,
})

</script>


<style lang="scss" scoped>

    .iconWrapper {

        background-color: #FFFFFF;
        width: 62px;
        height: 62px;
        border-radius: 100px;
        display: flex;
        justify-content: center;

        img {
            align-self: center;
            height: 29px;
        }
    }

</style>