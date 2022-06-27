<template>
    <div id="calendar-component">
        <div id="calendarbody" v-show="showAll">
            <div id="head" v-show="showCal">
                <p @click="monthBack" class="arrows">&larr;</p>
                <h1>{{ monthNames[month] + ' ' + year }}</h1>
                <p @click="monthForward" class="arrows">&rarr;</p>
            </div>
            <div id="calendar" v-show="showCal">
                <div v-for="day in firstDay" :key="day" class="placholder"></div>                
                <div v-for="weekday in weekdays" :key="weekday" class="placholder"></div>   
                <div v-for="day in daysInMonth" :key="day" class="day" :class="{'selected': selectedDay == day}" @click="selectDay(day)">
                    <p>{{weekdays[day.getDay()].slice(0, 1)}} <br> {{ day.getDate() }}</p>
                </div>
            </div>
            <div id="events">
                <div class="row event-row">
                    <div v-for="event in visibleEvents" :key="event">
                        <div class="row event-container">
                            <div class="col-sm-9 event-body" v-show="showCal" :class="{'favorite': favorites.includes(event)}">
                                <div class="row">
                                    <div class="col-sm-10 start_time_display" @click="showProgramm(event)">                        
                                        <div class="row">
                                            <div class="col-sm-12 room-display">
                                                <p>Raum: {{ roomNames[events.find(elem => elem.id == event).roomId] }}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <h5>{{ new Date(events.find(elem => elem.id == event).startDate).toTimeString().slice(0, 5) }}</h5>
                                            </div>
                                            <div class="col-sm-6 title_display">
                                                <h5>{{ events.find(elem => elem.id == event).name }}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-3 star" @click="$emit('favorEvent', event)">
                                        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="programm-container" v-if="showPr">
                        <ProgrammSite :event="{ ...events.find(elem => elem.id == e_key), roomName: roomNames[events.find(elem => elem.id == e_key).roomId] }" @closePr="hideProgramm"></ProgrammSite>
                    </div>
                </div>
            </div>
            <p class="close" @click="closeCalendar">&#10006;</p>
        </div>
        <div class="calendar-button" v-show="showBtn" @click="showCalendarComponent">
            <span>&#128197;</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
let weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
let month = ref(new Date().getMonth());
let monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
let year = ref(new Date().getFullYear());
let selectedDay = ref(null);
let showPr = ref(false);
let showCal = ref(true);
let showAll = ref(false);
let showBtn = ref(true);
let e_key = ref("");

const props = defineProps(["events", "favorites", "roomNames"])

const emit = defineEmits(["favorEvent"])

let daysInMonth = computed(() => {
    let temp = [];
    let days = new Date(year.value, month.value + 1, 0).getDate();

    for (let i = 1; i <= days; i++) {
        temp.push(new Date(year.value, month.value, i));
    }

    return temp;
});

let firstDay = computed(() => {
    let temp = new Date(year.value, month.value, 1).getDay() - 1;
    temp == -1 ? temp = 6 : null;
    return temp;
});

const visibleEvents = computed(() => {
    let temp = props.events.filter(elem => new Date(elem.startDate).toDateString() == new Date(selectedDay.value).toDateString())

    temp.sort((a, b) => {
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    })
   
    return temp.map(elem => elem.id);
})

function selectDay(day) {
    selectedDay.value = day;
}

function showProgramm(selectedEvent){
    e_key.value = selectedEvent;
    showPr.value = !showPr.value;
    showCal.value = !showCal.value;
}

function monthBack() {
    month.value -= 1;
    if (month.value == -1) {
        month.value = 11;
        year.value -= 1;
    }
}

function monthForward() {
    month.value += 1;
    if (month.value == 12) {
        month.value = 0;
        year.value += 1;
    }
}

function closeCalendar(){
    showAll.value = !showAll.value;
    showBtn.value = !showBtn.value;

}

function hideProgramm(){
    showPr.value = !showPr.value;
    showCal.value = !showCal.value;
}

function showCalendarComponent(){
    showAll.value = !showAll.value;
    showBtn.value = !showBtn.value;
}

</script>

<style>
#calendar-component{
    position: absolute;
    bottom: 15px;
    left: 25px;
    z-index: 1000;
}

@media (max-width: 550px){
    #calendar-component{
    bottom: 0px;
    left: 0px;
    }
}

#calendarbody{
    font-family: Arial,sans-serif;
    background: #363A45;
    color: #ffffff;
    padding: 5px 20px;
    border-radius: 10px;
    -webkit-box-shadow: 5px 5px 8px 0px rgba(0,0,0,0.53); 
    box-shadow: 5px 5px 8px 0px rgba(0,0,0,0.53);
}

#head {
    display: flex;
    justify-content: space-between;
    margin-bottom: -20px;
}

#head > h1{
    font-size: 25px;
    margin-top: 30px;
}

#head > p {
    padding: 16px;
    color: #eeeeee;
    cursor: pointer;
}

#calendar {
    display: grid; 
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr; 
    grid-template-rows: 40px 1fr 1fr 1fr 1fr 1fr 1fr; 
    gap: 15px 15px; 
}

.weekday {
    font-weight: bold;
    text-align: center;
}

.room-display p{
    margin-bottom: 0;
}

.day {
    box-sizing: border-box;
    padding: 5px 15px;
    background-color: none;
    text-align: center;
    cursor: pointer;
    margin-top: -10px;
}

.event-container{
    font-size: 20px;
}

.event-container h5{
    margin: 0;
    margin-top: 10px;
    font-weight: normal;
}

.event-row{
    overflow-y: auto;
    max-height: 280px;
}

.day:hover, .selected {
    background-color:rgb(95, 193, 160);
    border-radius: 5px;
}

.placholder {
    background-color: none;
    margin-top: -20px;
}

.star, .event-container, .close{
    cursor: pointer;
}

.event-body{
    margin: 20px auto;
    background: linear-gradient(90deg, rgba(59,76,149,1) 0%, rgba(88,158,181,1) 52%, rgba(120,239,217,1) 100%);
    border-radius: 5px;
    padding: 15px 30px;
    margin-top: 0;
}

.close{
    font-size: 25px;
}

.event-body.favorite {
    background: #ff0000;
}

.star svg {
    stroke: #ffffff;
    stroke-width: 1.5px;
}

.col-sm-10, .col-sm-3{
    display: inline-block;
}

.star{
    text-align: right;
    float: right;
    margin-top: 12px;
}

.room-display p{
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 0;
}

.favorite .star svg {
    fill: #ffffff;
}

.calendar-button{
    background: #ffffff;
    border-radius: 50px;
    width: 100px;
    text-align: center;
    height: 100px;
    align-items: center;
    display: flex;
    cursor: pointer;
}

.calendar-button > span{
    margin: 10px auto;
    align-self: center;
    font-size: 40px;
}

::-webkit-scrollbar {
  width: 5px;
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1bd; 
    border-radius: 5px;

}
 
::-webkit-scrollbar-thumb {
  background: rgb(139, 139, 139); 
    border-radius: 5px;

}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
}

</style>