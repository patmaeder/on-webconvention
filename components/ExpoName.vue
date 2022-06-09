<template>
    <div class="expoBox ">
        <div class="flexInfo">
            <p>{{dateRange}}</p>
            <h3>{{expoName}}</h3>
        </div>
        <div class="flexIcon">
            <img src="/icons/exit.svg" />
        </div>
    </div>
</template>

<script lang="ts" setup>

/*
 * ---------------
 * Props
 * ---------------
 */
const props = defineProps({
    dateRange: String,
    expoName: String,
})

</script>


<style lang="scss" scoped>

.expoBox {
    display: flex;
    justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #363A45;
    color: #FFFFFF;
    padding: 10px 25px 10px 25px;
    width: 600px;
    height: 100px;
    border-radius: 10px;

    .flexInfo {
        align-self: center;

        p {
            margin: 10px 0px 10px 0px;
            font-size: 20px;
            font-weight: lighter;
        }

        h3 {
            margin: 10px 0px 10px 0px;
            font-size: 24px;
            font-weight: bold;
        }
    }

    

    .flexIcon {
        align-self: center;

        img {
            width: 35px;
        }
    }
}

</style>