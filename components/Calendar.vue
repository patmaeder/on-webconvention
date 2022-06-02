<template>
    <div id="calendar-component">
    <div id="calendarbody" v-show="showAll">
        <div id="head" v-show="showCal">
            <p @click="monthBack" class="arrows">&larr;</p>
            <h1>{{ monthNames[month] + ' ' + year }}</h1>
            <p @click="monthForward" class="arrows">&rarr;</p>
        </div>
        <div id="calendar" v-show="showCal">
            <div v-for="weekday in weekdays" :key="weekday" class="placholder">
            </div>   
            <div v-for="day in firstDay" :key="day" class="placholder">
            </div>
            <div v-for="day in daysInMonth" :key="day" class="day" :class="{'selected': selectedDay == day}" @click="selectDay(day)">
                <p>{{weekdays[day.getDay()].slice(0, 1)}} <br> {{ day.getDate() }}</p>
            </div>
        </div>
        <div id="events">
            <div class="row">
            <div v-for="event in visibleEvents" :key="event">
                <div class="row event-container">
                    <div class="col-sm-9 event-body" v-show="showCal">
                        <div class="row">
                            <div class="col-sm-10 start_time_display" @click="showProgramm(event)">                        
                                <div class="row">
                                    <div class="col-sm-12 room-display">
                                        <p>{{ events[event].room }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-2">
                                        <h5>{{ events[event].start_time }}</h5>
                                    </div>
                                    <div class="col-sm-8 title_display">
                                        <h5>{{ events[event].title }}</h5>
                                    </div>    
                                </div>
                            </div>
                            <div class="col-sm-2 star" @click="change_favorite(event)">
                                <p>{{ events[event].star }}</p>
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>
                <div id="programm-container" v-if="showPr">
                    <ProgrammSite :event="events[e_key]" @closePr="hideProgramm"></ProgrammSite>
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

<script setup>
import { ref, computed } from 'vue'
import ProgrammSite from "./ProgrammSite.vue"

let weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
let month = ref(new Date().getMonth());
let monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
let year = ref(new Date().getFullYear());
let selectedDay = ref(null);

//später leeren, wenn Eventform fertig
let events = ref({
    "8482134": {title: "ABC-Kurs", start_time: "15:30", end_time: "18:00", date: "2022/06/30", room: "123", description: "Das ist ein ABC-Kurs.", favorite: "false", star: "\u2606"},
    "1346325": {title: "DC-Kurs", start_time: "15:00", end_time: "17:00", date: "2022/06/30", room: "456", description: "Das ist ein DC-Kurs.", favorite: "false", star: "\u2606"},
});
let showPr = ref(false);
let showCal = ref(true);
let showAll = ref(false);
let starUnfilled = ref("\u2606");
let starFilled = ref("\u2605");
let showBtn = ref(true);
let e_key = ref("");
let favorites = ref([]);
const staritem = {star: "\u2606"};

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

let visibleEvents = computed(() => {
    let temp = [];

    for(let key of Object.keys(events.value)){
        let value = events.value[key]; 
        if(new Date(value.date).toDateString() == new Date(selectedDay.value).toDateString()){
             temp.push(key);
        }  
        console.log(value)
    }
    return temp;
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

//später an Eventformlogik anpassen -> Logik einfügen
function add_event(submitEvent){
    let output = {};
    // Object.assign(output, favoriteObj);
    Object.assign(output, staritem);
    output['title'] = submitEvent.target.elements.title.value;
    output['date'] = submitEvent.target.elements.date.value;
    output['start_time'] = submitEvent.target.elements.starttime.value;
    output['end_time'] = submitEvent.target.elements.endtime.value;
    output['descr'] = submitEvent.target.elements.description.value;
    output['room'] = submitEvent.target.elements.room.value;

    events.value[new Date().valueOf()] = {...output};
    console.log(events);
}

function monthForward() {
    month.value += 1;
    if (month.value == 12) {
        month.value = 0;
        year.value += 1;
    }
}

function delete_event(id){
        var key = id;
        events.value[key] = undefined;
        //auch hier bessere Lösung?
        delete events.value[key];
}

function closeCalendar(){
    showAll.value = !showAll.value;
    showBtn.value = !showBtn.value;

}

function change_favorite(index){
    var i = favorites.value.indexOf(index);
    favorites.value.includes(index) === true ? favorites.value.splice(i, 1) : favorites.value.push(index);
    favorites.value.includes(index) === true ? events.value[index].star = starFilled.value : events.value[index].star = starUnfilled.value;
    console.log(favorites.value);
    // events.value[index].favorite = !events.value[index].favorite;
    // events.value[index].favorite === true ? events.value[index].star = starFilled.value : events.value[index].star = starUnfilled.value;
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
    padding: 20px;
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 50px;
}

#calendarbody{
    font-family: Arial,sans-serif;
    max-width: 40vw;
    background: #282828;
    color: #ffffff;
    padding: 5px 20px;
}

#head {
    display: flex;
    justify-content: space-between;
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
    gap: 10px 10px; 
    
}

.weekday {
    font-weight: bold;
    text-align: center;
}

.day {
    box-sizing: border-box;
    padding: 10px;
    background-color: #6600ff;
    text-align: center;
    cursor: pointer;
}

.day:hover {
    background-color:rgb(95, 193, 160);
}

.selected {
    background-color:rgb(95, 193, 160);
}

.placholder {
    background-color: none;
}

.star, .event-container, .close{
    cursor: pointer;
}

.event-body{
    margin: 10px auto !important;
    background: #4bb1ff;
}

.star{
    font-size: 30px;
    margin-top: 15px;
    text-align: right;
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

</style>