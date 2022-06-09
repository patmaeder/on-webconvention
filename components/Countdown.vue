<template>
    <main>
        <div id="countdown-body">
            <h2>Das Event startet bald:</h2>
                <div class="countdown-values">
                    <div class="countdown-cell">
                        <span>{{ days }}</span>
                        <p>Tage</p>
                    </div>
                    <div class="countdown-cell">
                        <span class="seperator">:</span><br><br><br>
                    </div>   
                    <div class="countdown-cell">
                        <span>{{ hours }}</span>
                        <p>Stunden</p>
                    </div>    
                    <div class="countdown-cell">
                        <span class="seperator">:</span><br><br><br>
                    </div>                
                    <div class="countdown-cell">
                        <span>{{ minutes }}</span>
                        <br>
                        <p>Minuten</p>
                    </div>
                    <div class="countdown-cell">
                        <span class="seperator">:</span><br><br><br>
                    </div>   
                    <div class="countdown-cell">
                        <span>{{ additionalNull }}{{ seconds }}</span>
                        <br>
                        <p>Sekunden</p>
                    </div>
                </div>                
            </div>

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
const additionalNull = ref();

let eventDate = new Date(events['13784734'].date);

let timeToConvert = events['13784734'].start_time.split(':');

let eventHour = parseInt(timeToConvert[0]);
let eventMinutes = parseInt(timeToConvert[1]);

eventDate.setHours(eventHour);
eventDate.setMinutes(eventMinutes);

let countDownDate = eventDate.getTime();

setInterval(() => {
    let today = new Date();
    let diffTime = countDownDate - today;

    days.value = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((diffTime % (1000 * 60)) / 1000);
    seconds.value < 10 ? additionalNull.value = 0 : additionalNull.value = null;

}, 1000);
</script>

<style scoped>
#countdown-body{
    margin: 0 auto;
}

.countdown-values{
    align-items: center;
    text-align: center;
}

.countdown-cell{
    display: inline-block;
    min-width: 50px;
    margin: 5px 0;
    text-align: center;
    font-size: 40px;
}
.seperator{
    display: inline-block;
}
</style>