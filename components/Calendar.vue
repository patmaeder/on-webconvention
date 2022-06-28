<template>
    <div id="calendar-component">
        <div id="calendarbody" v-show="showAll">
            <div id="switch" v-show="showCal">
                <div id="overview" @click="showOverview" :class="{'activated': overviewActive}">Überblick</div>
                <div id="favoriteEvents" @click="showFavorites" :class="{'activated': favoriteActive}">Favoriten</div>
            </div>
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
                    <div v-for="event in visibleEvents" :key="event">
                        <div v-if="new Date(events.find(elem => elem.id == event).startDate).toDateString() == day.toDateString()" class="event-circle">
                            X
                        </div>
                    </div>
                </div>
            </div>
            <div id="events">
                <div class="row event-row">
                    <div v-for="event in visibleEvents" :key="event">
                        <div class="row event-container" v-show="showOverviewContainer">
                            <div class="col-sm-9 event-body" v-show="showCal" :class="{'favorite': favorites.includes(event)}">
                                <div class="row">
                                    <div class="col-sm-10 start_time_display" @click="showProgramm(event)">                        
                                        <div class="row">
                                            <div class="col-sm-12 room-display">
                                                <p>Raum: {{ events.find(elem => elem.id == event).roomId }}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <h5>{{ new Date(events.find(elem => elem.id == event).startDate).toTimeString().slice(0, 5) }} Uhr</h5>
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
                        <div class="row event-container" v-show="showFavoriteContainer" v-if="favorites.includes(event)">
                            <div class="col-sm-9 event-body" v-show="showCal" :class="{'favorite': favorites.includes(event)}">
                                <div class="row">
                                    <div class="col-sm-10 start_time_display" @click="showProgramm(event)">                        
                                        <div class="row">
                                            <div class="col-sm-12 room-display">
                                                <p>Raum: {{ events.find(elem => elem.id == event).roomId }}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-3">
                                                <h5>{{ new Date(events.find(elem => elem.id == event).startDate).toTimeString().slice(0, 5) }} Uhr</h5>
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
                        <ProgrammSite :event="events.find(elem => elem.id == e_key)" @closePr="hideProgramm"></ProgrammSite>
                    </div>
                </div>
            </div>
            <p class="close" @click="closeCalendar">&#10006;</p>
        </div>
        <div class="calendar-button" v-show="showBtn" @click="showCalendarComponent">
            <span>
                <svg class="calendar-icon" width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 11.1111C0 8.16426 1.17063 5.33811 3.25437 3.25437C5.3381 1.17063 8.16426 0 11.1111 0H52.8889C55.8357 0 58.6619 1.17063 60.7456 3.25437C62.8294 5.33811 64 8.16426 64 11.1111V14.2222H0V11.1111ZM0 18.6667V52.8889C0 55.8357 1.17063 58.6619 3.25437 60.7456C5.3381 62.8294 8.16426 64 11.1111 64H52.8889C55.8357 64 58.6619 62.8294 60.7456 60.7456C62.8294 58.6619 64 55.8357 64 52.8889V18.6667H0ZM21.3333 31.1111C21.3333 32.2899 20.8651 33.4203 20.0316 34.2538C19.1981 35.0873 18.0676 35.5556 16.8889 35.5556C15.7101 35.5556 14.5797 35.0873 13.7462 34.2538C12.9127 33.4203 12.4444 32.2899 12.4444 31.1111C12.4444 29.9324 12.9127 28.8019 13.7462 27.9684C14.5797 27.1349 15.7101 26.6667 16.8889 26.6667C18.0676 26.6667 19.1981 27.1349 20.0316 27.9684C20.8651 28.8019 21.3333 29.9324 21.3333 31.1111ZM32 35.5556C30.8213 35.5556 29.6908 35.0873 28.8573 34.2538C28.0238 33.4203 27.5556 32.2899 27.5556 31.1111C27.5556 29.9324 28.0238 28.8019 28.8573 27.9684C29.6908 27.1349 30.8213 26.6667 32 26.6667C33.1787 26.6667 34.3092 27.1349 35.1427 27.9684C35.9762 28.8019 36.4444 29.9324 36.4444 31.1111C36.4444 32.2899 35.9762 33.4203 35.1427 34.2538C34.3092 35.0873 33.1787 35.5556 32 35.5556ZM51.5556 31.1111C51.5556 32.2899 51.0873 33.4203 50.2538 34.2538C49.4203 35.0873 48.2899 35.5556 47.1111 35.5556C45.9324 35.5556 44.8019 35.0873 43.9684 34.2538C43.1349 33.4203 42.6667 32.2899 42.6667 31.1111C42.6667 29.9324 43.1349 28.8019 43.9684 27.9684C44.8019 27.1349 45.9324 26.6667 47.1111 26.6667C48.2899 26.6667 49.4203 27.1349 50.2538 27.9684C51.0873 28.8019 51.5556 29.9324 51.5556 31.1111ZM16.8889 49.7778C15.7101 49.7778 14.5797 49.3095 13.7462 48.476C12.9127 47.6425 12.4444 46.5121 12.4444 45.3333C12.4444 44.1546 12.9127 43.0241 13.7462 42.1906C14.5797 41.3571 15.7101 40.8889 16.8889 40.8889C18.0676 40.8889 19.1981 41.3571 20.0316 42.1906C20.8651 43.0241 21.3333 44.1546 21.3333 45.3333C21.3333 46.5121 20.8651 47.6425 20.0316 48.476C19.1981 49.3095 18.0676 49.7778 16.8889 49.7778ZM36.4444 45.3333C36.4444 46.5121 35.9762 47.6425 35.1427 48.476C34.3092 49.3095 33.1787 49.7778 32 49.7778C30.8213 49.7778 29.6908 49.3095 28.8573 48.476C28.0238 47.6425 27.5556 46.5121 27.5556 45.3333C27.5556 44.1546 28.0238 43.0241 28.8573 42.1906C29.6908 41.3571 30.8213 40.8889 32 40.8889C33.1787 40.8889 34.3092 41.3571 35.1427 42.1906C35.9762 43.0241 36.4444 44.1546 36.4444 45.3333Z" fill="#344D54"/>
                </svg>
            </span>
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


let showPr = ref(false);
let showCal = ref(true);
let showAll = ref(false);
let showBtn = ref(true);
let e_key = ref("");
let propEvents = ref(props.events);
let showFavoriteContainer = ref(false);
let showOverviewContainer = ref(true);
let overviewActive = ref(true);
let favoriteActive = ref(false);

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

function showOverview(){
    showFavoriteContainer.value = false;
    showOverviewContainer.value = true;
    overviewActive.value = true;
    favoriteActive.value = false;
}

function showFavorites(){
    showFavoriteContainer.value = true;
    showOverviewContainer.value = false;
   overviewActive.value = false;
    favoriteActive.value = true;
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

#switch{
    display: flex;
    justify-content: space-between;
}

#overview, #favoriteEvents{
    background: #252830;
    margin: 0 auto;
    border-radius: 12px;
    font-size: 18px;
    padding: 10px 55px;
    margin-top: 25px;
    cursor: pointer;
}

.activated{
    background: #79F0DA !important;
    color: #252830 !important;
}

.calendar-icon{
    margin-top: 10px;
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

.event-circle{
    background: grey;
    border-radius: 50px;
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