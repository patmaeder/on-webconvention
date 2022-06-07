<template>
    <div class="expoBox ">
        <div class="flexTime">
            <p>{{currentOrNext}}</p>
            <p>{{time}}</p>
        </div>
        <div class="flexContent">
            <h3>{{agendaItem}}</h3>
        </div>
        <div v-if="favorite" class="flexIcon">
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
    currentOrNext: String,
    time: String,
    agendaItem: String,
    favorite: Boolean,
})

</script>


<style lang="scss" scoped>

.expoBox {
    display: flex;
    //justify-content: space-between;
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(to right, #3B5695, #79F0DA);
    color: #FFFFFF;
    padding: 10px 25px 10px 25px;
    width: 375px;
    height: 78px;
    border-radius: 10px;

    .flexTime {
        align-self: center;

        p:first-child {
            margin: 10px 0px 10px 0px;
            font-size: 12px;
            font-weight: medium;
        }

        p:last-child {
            margin: 10px 0px 10px 0px;
            font-size: 16px;
            font-weight: medium;
        }
    }

    .flexContent {
        align-self: center;
        margin-left: 20px;
        margin-top: 25px;

        h3 {
            margin: 10px 0px 10px 0px;
            font-size: 16px;
            font-weight: medium;
        }
    }    

    .flexIcon {
        align-self: center;
        margin-left: auto;

        img {
            width: 24px;
        }
    }
}

</style>