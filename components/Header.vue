<template>
  <nav class="navigation navigation__container">
    <div class="navigation__inner">
      <div class="navigation__title">on19-Eventplattform</div>
      <div class="navigation__header" v-if="expo && timeFrame">
        <div class="navigation__header-date">
          {{timeFrame}}
        </div>
        <div class="navigation__header-title">
          {{expo.name}}
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import {useStore} from "../store";
  import { format} from "date-fns";

  definePageMeta({ layout: "no-header" });

  const store = useStore();
  const timeFrame = ref(null);

  const { data: expo } = await useFetch('/api/expo');

  watchEffect(() => {
    if(!expo.value) {
      return;
    }

    let startDate = new Date(expo.value.startDate);
    let endDate = new Date(expo.value.endDate);
    let template = "dd.MM.";

    if(startDate.getFullYear() !== endDate.getFullYear()) {
      template = "dd.MM.yyyy"
    }

    timeFrame.value = `${format(startDate, template)} - ${format(endDate, template)}`;
  })
</script>