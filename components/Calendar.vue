<template>
    <div id="calendar-component">
        <div id="calendarbody" v-show="showAll">
            <div id="head" v-show="showCal">
                <p @click="monthBack" class="arrows">&larr;</p>
                <h1>{{ monthNames[month] + ' ' + year }}</h1>
                <p @click="monthForward" class="arrows">&rarr;</p>
            </div>
            <div id="calendar" v-show="showCal">
                <div v-for="weekday in weekdays" :key="weekday" class="placholder"></div>   
                <div v-for="day in firstDay" :key="day" class="placholder"></div>
                <div v-for="day in daysInMonth" :key="day" class="day" :class="{'selected': selectedDay == day}" @click="selectDay(day)">
                    <p>{{weekdays[day.getDay()].slice(0, 1)}} <br> {{ day.getDate() }}</p>
                </div>
            </div>
            <div id="events">
                <div class="row">
                    <div v-for="event in visibleEvents" :key="event">
                        <div class="row event-container">
                            <div class="col-sm-9 event-body" v-show="showCal" :class="{'favorite': favorites.includes(event)}">
                                <div class="row">
                                    <div class="col-sm-10 start_time_display" @click="showProgramm(event)">                        
                                        <div class="row">
                                            <div class="col-sm-12 room-display">
                                                <p>{{ events.find(elem => elem.id == event).room }}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-2">
                                                <h5>{{ new Date(events.find(elem => elem.id == event).startDate).toTimeString().slice(0, 5) }}</h5>
                                            </div>
                                            <div class="col-sm-8 title_display">
                                                <h5>{{ events.find(elem => elem.id == event).name }}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-2 star" @click="$emit('favorEvent', event)">
                                        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 0L14.6942 8.2918H23.4127L16.3593 13.4164L19.0534 21.7082L12 16.5836L4.94658 21.7082L7.64074 13.4164L0.587322 8.2918H9.30583L12 0Z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="programm-container" v-if="showPr">
                        <ProgrammSite :event="events.find(elem => elem.id == e_key)" @closePr="hideProgramm"></ProgrammSite>
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

const props = defineProps(["events", "favorites"])

//später leeren, wenn Eventform fertig
/*let events = ref({
    "8482134": {title: "ABC-Kurs", start_time: "15:30", end_time: "18:00", date: "2022/06/30", room: "123", description: "Das ist ein ABC-Kurs.", favorite: "false", star: "\u2606"},
    "1346325": {title: "DC-Kurs", start_time: "15:00", end_time: "17:00", date: "2022/06/30", room: "456", description: "Das ist ein DC-Kurs.", favorite: "false", star: "\u2606"},
});*/
let showPr = ref(false);
let showCal = ref(true);
let showAll = ref(false);
//let starUnfilled = ref("\u2606");
//let starFilled = ref("\u2605");
let showBtn = ref(true);
let e_key = ref("");
//let favorites = ref([]);
//const staritem = {star: "\u2606"};

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

/*function change_favorite(index){
    var i = favorites.value.indexOf(index);
    favorites.value.includes(index) === true ? favorites.value.splice(i, 1) : favorites.value.push(index);
    favorites.value.includes(index) === true ? events.value[index].star = starFilled.value : events.value[index].star = starUnfilled.value;
    console.log(favorites.value);
    // events.value[index].favorite = !events.value[index].favorite;
    // events.value[index].favorite === true ? events.value[index].star = starFilled.value : events.value[index].star = starUnfilled.value;
}*/

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
    bottom: 50px;
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

.event-body.favorite {
    background: #ff0000;
}

.star svg {
    stroke: #ffffff;
    stroke-width: 1.5px;
}

.favorite .star svg {
    fill: #ffffff
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