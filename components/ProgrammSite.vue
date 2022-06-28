<template>
  <div class="container-programm">
    <div class="row">
      <div class="back-programm" @click="$emit('closePr')">
        &larr;
      </div>
      <section id="calendar-records">
        <div class="event-body-programm">
          <div class="room-display-programm">
            <p>Raum: {{ event.roomName }}</p>
          </div>
          <div class="start_time_display-programm">
            <h5>{{ new Date(event.startDate).toTimeString().slice(0, 5) }}</h5>
          </div>
          <div class="title_display-programm">
            <h5>{{ event.name }}</h5>
          </div>
        </div>
      </section>
    </div>
    <div class="info-container-programm">
      <h3>Beschreibung:</h3>
      <p>
          {{ event.description }}
      </p>
      <h3>Datum:</h3>
      <p class="date-container-programm">
        {{ new Date(event.startDate).toTimeString().slice(0, 5) }} Uhr - {{ new Date(event.endDate).toTimeString().slice(0, 5) }} Uhr<br>
        {{ String(new Date(event.startDate).getDate()).padStart(2, '0') }}.{{ String(new Date(event.startDate).getMonth()+1).padStart(2, '0') }}.{{ new Date(event.startDate).getFullYear() }} 
      </p>
    </div>

    <div v-if="new Date().getTime() > new Date(event.startDate).getTime() && new Date().getTime() < new Date(event.endDate).getTime()">
      <NuxtLink :to="`/meeting/${event.roomId}`">
        Veranstaltung beitreten
      </NuxtLink>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(["closePr"]);

const props = defineProps({
    event: Object,
});

</script>

<style>

.back-programm{
  cursor: pointer;
  display: inline;
  float: left;
  margin-top: 20px !important;
}

.info-container-programm{
  margin-left: 48px;
}

.container-programm p {
  line-height: 30px;
  margin: 5px;
  margin-left: 0;
}

.container-programm h5{
  font-size: 18px;
  margin: 10px;
  margin-left: 0;
  display: inline;
  font-weight: normal;
}

.start_time_display-programm, .title_display-programm{
  display: inline;
}

.title_display-programm{
    font-size: 16px;
    margin-top: 0;
}

.container-programm h3{
  margin-bottom: 0;
}

.container-programm{
  max-width: 60vw;
  padding: 10px 0px;
  padding-top: 25px;

}

@media(max-width: 550px){
  .container-programm{
  max-width: 100vw;
  }
}

.event-body-programm{
    margin-left: 50px;
    margin-bottom: 20px;
    max-width: 450px;
    background: linear-gradient(90deg, rgba(59,76,149,1) 0%, rgba(88,158,181,1) 52%, rgba(120,239,217,1) 100%);
    border-radius: 5px;
    padding: 15px 30px;
}

.close-programm, .back-programm{
  margin: 0;
  font-size: 25px;
  cursor: pointer;

}

.date-container-programm{
  margin-bottom: 0;
}

.room-display-programm p {
  margin-left: 0;
  margin-top: 0;
  font-size: 14px;
}

.container-programm > div:nth-child(3) {
  display: flex;
  justify-content: flex-end;
}

.container-programm > div:nth-child(3) a {
  margin-right: 20px;
  padding: 16px 26px;
  background: linear-gradient(90deg,#3b4c95,#589eb5 52%,#78efd9);
  border-radius: 6px;
  text-decoration: none;
}

</style>
