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

    @media screen and (min-width: 400px) {
        width: 250px;
        height: 60px;
    }

    @media screen and (min-width: 576px) {
        width: 300px;
        height: 70px;
    }

    @media screen and (min-width: 992px) {
        width: 580px;
        height: 95px;
    }

    .flexInfo {
        align-self: center;

        p {
            margin: 10px 0px 10px 0px;
            font-weight: lighter;
        }

        h3 {
            margin: 10px 0px 10px 0px;
            font-weight: bold;
        }

        @media screen and (min-width: 400px) {
            p {
                font-size: 16px;
            }

            h3 {
                font-size: 19px;
            }
        }

        @media screen and (min-width: 576px) {
            p {
                font-size: 17px;
            }

            h3 {
                font-size: 20px;
            }
        }

        @media screen and (min-width: 992px) {
            p {
                font-size: 20px;
            }

            h3 {
                font-size: 24px;
            }
        }
    }

    

    .flexIcon {
        align-self: center;

        img {
            width: 100%;
        }
    }
}

</style>