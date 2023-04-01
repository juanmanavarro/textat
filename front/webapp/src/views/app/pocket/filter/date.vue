<template>
  <ion-modal
    :keep-contents-mounted="true"
    @willPresent="null"
    ref="datetimeModal"
  >
    <ion-datetime
      id="datetime"
      ref="dateFilter"
      presentation="date"
      :show-default-buttons="true"
      @ionChange="select"
      :max="$date.today.toISOString()"
      :is-date-enabled="isEnabled"
      :firstDayOfWeek="1"
      :locale="locale"
    >
      <ion-buttons slot="buttons">
        <ion-button color="danger" @click="reset">Reset</ion-button>
        <ion-button color="primary" @click="datetimeModal.$el.dismiss()">Cancel</ion-button>
        <ion-button color="primary" @click="dateFilter.$el.confirm()">Done</ion-button>
      </ion-buttons>
    </ion-datetime>
  </ion-modal>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { usePostStore } from '@/stores/post.js';
import { IonDatetime, IonModal, IonButtons, IonButton } from '@ionic/vue';

const postStore = usePostStore();

const datetimeModal = ref(null);
const dateFilter = ref(null);
const locale = ref(null);

const isEnabled = computed(() => {
  postStore.dates; // TODO wtf
  return date => postStore.dates.find(d => d.created_at === date)
});

const select = (e) => {
  postStore.search({ date: e.detail.value });
  datetimeModal.value.$el.dismiss();
}

const reset = () => {
  postStore.search({ date: null });
  datetimeModal.value.$el.dismiss();
}

const setToday = () => {
  var today = new Date();
  today.setUTCHours(0,0,0,0);
  select(today);
}

onMounted(async () => {
  locale.value = window.navigator.language || window.navigator.userLanguage || 'en-GB';
  await postStore.fetchDates();
});
</script>
