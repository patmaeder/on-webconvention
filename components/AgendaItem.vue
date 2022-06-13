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

    @media screen and (min-width: 400px) {
        width: 180px;
        height: 35px;
    }

    @media screen and (min-width: 576px) {
        width: 200px;
        height: 40px;
    }

    @media screen and (min-width: 992px) {
        width: 340px;
        height: 70px;
    }

    .flexTime {
        align-self: center;

        p:first-child {
            margin: 10px 0px 10px 0px;
            font-weight: medium;
        }

        p:last-child {
            margin: 10px 0px 10px 0px;
            font-weight: medium;
        }

        @media screen and (min-width: 400px) {
            p:first-child {
                font-size: 9px;
            }

            p:last-child {
                font-size: 12px;
            }
        }

        @media screen and (min-width: 576px) {
            p:first-child {
                font-size: 10px;
            }

            p:last-child {
                font-size: 13px;
            }
        }

        @media screen and (min-width: 992px) {
            p:first-child {
                font-size: 12px;
            }

            p:last-child {
                font-size: 16px;
            }
        }
    }

    .flexContent {
        align-self: center;
        margin-left: 15px;
        margin-top: 23px;

        h3 {
            margin: 10px 0px 10px 0px;
            font-weight: medium;
        }

        @media screen and (min-width: 400px) {
            h3 {
                font-size: 12px;
            }
        }

        @media screen and (min-width: 576px) {
            h3 {
                font-size: 13px;
            }
        }

        @media screen and (min-width: 992px) {
            h3 {
                font-size:16px;
            }
        }
    }    

    .flexIcon {
        align-self: center;
        margin-left: auto;


        @media screen and (min-width: 400px) {
            img {
                width: 50%;
            }
        }

        @media screen and (min-width: 576px) {
            img {
                width: 60%;
            }
        }

        @media screen and (min-width: 992px) {
            img {
                width: 85%;
            }
        }
    }
}

</style>