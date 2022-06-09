<template>
    <main>
        <div id="countdown-body">
            <div class="row">
                <h2>Das Event startet bald:</h2>
            </div>
            <div class="row">
                <div class="countdown-cell">
                    <span>{{ days }}</span> <br>
                    <p>Tage</p>
                </div>
                <div class="seperator">:</div>
                <div class="countdown-cell">
                    <span>{{ hours }}</span> <br>
                    <p>Stunden</p>
                </div>
                <div class="seperator">:</div>
                <div class="countdown-cell">
                    <span>{{ minutes }}</span> <br>
                    <p>Minuten</p>
                </div>
                <div class="seperator">:</div>
                <div class="countdown-cell">
                    <span>{{ seconds }}</span> <br>
                    <p>Sekunden</p>
                </div>
                <div class="seperator">:</div>
            </div>
        </div>
    </main>
</template>

<script setup>

let events = ref({
    '13784734': {
        title: 'ABC-Kurs',
        description: 'Das ist ein ABC-Kurs',
        room: '123',
        date: '2022-09-01',
        start_time: '08:00',
        end_time: '10:00',
    }
});

let days = ref();
let hours = ref();
let seconds = ref();
let minutes = ref();

let eventDate = new Date(events.value['13784734'].date);

console.log(eventDate);

</script>

<style scoped>
.countdown-cell{
    display: inline-block;
    width: 50px;
}
.seperator{
    display: inline-block;
}
</style>