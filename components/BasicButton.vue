<template>
    <button type="button" class="basicButton">{{content}}</button>
</template>

<script lang="ts" setup>

/*
 * ---------------
 * Props
 * ---------------
 */
const props = defineProps({
    content: String,
})

</script>


<style lang="scss" scoped>

.basicButton {
    padding: 13px 25px 13px 25px;
    width: 294px;
    color: #FFFFFF;
    background: linear-gradient(to right, #79F0DA, #3B4595);
    font-size: 20px;
    font-weight: bold;
    border-radius: 10px;
    border: 0;

    @media screen and (max-width: 768px) {
        padding: 9px 15px 9px 15px;
        width: 200px;
        font-size: 17px;
    }
}

</style>