<template>
    <main>
        <div id="countdown-body">
            <h2>Veranstaltungsbeginn</h2>
                <div class="countdown-values">
                    <div class="countdown-cell">
                        <div class="number">
                            <div class="number-item number-top" :class="{ flipDown: daysActive }">
                                <span>{{ daysNull }}{{ days }}</span>
                            </div>
                            <div class="number-item number-fixed">
                                <span>{{ daysNull }}{{ days-1 }}</span>
                            </div>
                             <div class="number-item number-bottom">00</div>
                        </div>
                        <p class="time-name">Tage</p>
                    </div>   
                    <div class="countdown-cell">
                        <div class="number">
                            <div class="number-item number-top" :class="{ flipDown: hoursActive }">
                                <span>{{ hoursNull }}{{ hours }}</span>
                            </div>
                            <div class="number-item number-fixed">
                                <span>{{ hoursNull }}{{ hours-1 }}</span>
                            </div>
                             <div class="number-item number-bottom">00</div>
                        </div>
                        <p class="time-name">Stunden</p>
                    </div>                    
                    <div class="countdown-cell">
                        <div class="number">
                            <div class="number-item number-top" :class="{ flipDown: minutesActive }">
                                <span>{{ minutesNull }}{{ minutes }}</span>
                            </div>
                            <div class="number-item number-fixed">
                                <span>{{ minutesNull }}{{ minutes-1 }}</span>
                            </div>
                             <div class="number-item number-bottom">00</div>
                        </div>
                        <p class="time-name">Minuten</p>
                    </div>   
                    <div class="countdown-cell">
                        <div class="number">
                            <div class="number-item number-top" :class="{ flipDown: secondsActive }">
                                <span>{{ secondsNull }}{{ seconds }}</span>
                            </div>
                            <div class="number-item number-fixed">
                                <span>{{ secondsNull }}{{ seconds-1 }}</span>
                            </div>
                            <div class="number-item number-bottom">00</div>
                        </div>
                        <p class="time-name">Sekunden</p>
                    </div>
                </div>                
            </div>

            <div class="quader"></div>

    </main>
</template>

<script setup>
import {ref} from 'vue';
let events = {
    '13784734': {
        title: 'ABC-Kurs',
        description: 'Das ist ein ABC-Kurs',
        room: '123',
        date: '2022-09-01',
        start_time: '08:00',
        end_time: '10:00',
    }
};

let days = ref();
let hours = ref();
let seconds = ref();
let minutes = ref();
const minutesNull = ref(0);
const hoursNull = ref(0);
const secondsNull = ref(0);
const daysNull = ref(0);
let secondsActive = ref(false);
let minutesActive = ref(false);
const hoursActive = ref(false);
const daysActive = ref(false);

const emit = defineEmits(["stopCountdown"]);

const props = defineProps({
    startTime: Date,
});

let dateProperty = startTime.value;

let eventDate = new Date(dateProperty);

// let timeToConvert = events['13784734'].start_time.split(':');

// let eventHour = parseInt(timeToConvert[0]);
// let eventMinutes = parseInt(timeToConvert[1]);

// eventDate.setHours(eventHour);
// eventDate.setMinutes(eventMinutes);

let countDownDate = eventDate.getTime();

setInterval(() => {
    let today = new Date();
    let diffTime = countDownDate - today;

    days.value = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    days.value < 10 ? daysNull.value = 0 : daysNull.value = undefined;
    hours.value < 10 ? hoursNull.value = 0 : hoursNull.value = undefined;
    minutes.value < 10 ? minutesNull.value = 0 : minutesNull.value = undefined;
    seconds.value < 10 ? secondsNull.value = 0 : secondsNull.value = undefined;

}, 1000);

watchEffect(() => {
    if(seconds.value){
        secondsActive.value = !secondsActive.value;
    }
    seconds.value === 0 ? minutesActive.value = true : minutesActive.value = false;
    minutes.value === 0 ? hoursActive.value = true : hoursActive.value = false;
    hours.value === 0 ? daysActive.value = true : daysActive.value = false;
})
</script>

<style scoped>
#countdown-body{
    margin: 0 auto;
    background: rgb(59,76,149);
    background: linear-gradient(90deg, rgba(59,76,149,1) 0%, rgba(88,158,181,1) 52%, rgba(120,239,217,1) 100%);
    width: 60%;
    padding: 50px;
    border-radius: 10px;
}

#countdown-body > h2{
    color: #EBF6F7;
    text-align: center;
    font-size: 50px;
    margin-top: 0;
}

.countdown-values{
    align-items: center;
    text-align: center;
}

.countdown-cell{
    display: inline-block;
    min-width: 170px;
    margin: 5px 10px;
    padding: 20px;
    text-align: center;
    color: #EBF6F7;
}

.time-name{
    text-transform: uppercase;
    font-size: 20px;
}

.number{
     font-weight: bold;    
     font-size: 70px;
}

.number-fixed{
    background: #353a46 !important;    
}

.number-item{
    height: 70px;
    border-radius: 10px;     
    background: #252830;    
    padding: 0 25px;
    min-width: 130px;
}

.number-top{
    position: absolute;
}

.number span {
    margin-top: 20px;
}

.flipDown{
    animation: flip-down 1s linear;
}

@keyframes flip-down {
    0%{
        transform: translateY(0%) rotateX(0deg);
    }

    20%{
        color: #EBF6F7;  
    }

    35%{
        color: #252830;
    }

    100%{
        transform: translateY(100%) rotateX(180deg);
        color: #252830;
    }
}
</style>