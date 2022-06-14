<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-1 back" @click="$emit('closePr')">
        &larr;
      </div>

      <div class="col-sm-9">
          <section id="calendar-records">
              <div class="row event-body">
                <div class="col-sm-9">
                  <div class="row">
                    <div class="col-sm-12 room-display">
                      <p>{{ event.room }}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm-2 start_time_display">
                      <h5>{{ event.start_time }}</h5>
                    </div>
                    <div class="col-sm-4 title_display">
                      <h5>{{ event.title }}</h5>
                    </div>
                  </div>
                </div>
          </div>
        </section>
      </div>
    </div>
    <div class="row">
      <h3>Beschreibung:</h3>
    </div>
    <div class="row">
      <p>
          {{ event.descr }}
      </p>
    </div>
    <div class="row"><h3>Datum:</h3></div>
    <div class="row">
      <p>
        {{ event.start_time }} Uhr - {{ event.end_time }} Uhr<br>
        {{ event.date }}   
      </p>

    </div>
    <br><br>
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

.back{
  cursor: pointer;
}

.event-body{
    margin: 10px auto !important;
    background: #4bb1ff;
}

</style>
