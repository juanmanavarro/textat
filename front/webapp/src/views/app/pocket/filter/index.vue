<template>
  <ion-toolbar style="height:54px">
    <div class="py-2 bg-light fixed-top">
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-3 d-flex align-items-center m-0">
            <search
              @focus="showFilters = true"
              @blur="showFilters = false"
            />
          </div>
        </div>
      </div>
    </div>
  </ion-toolbar>
  <div class="bg-light">
    <div class="container">
      <div
        v-if="showFilters"
        class="pb-2 d-flex justify-content-start align-items-center filter-bar overflow-auto"
      >
        <ion-datetime-button
          datetime="datetime"
          :disabled="postStore.loading"
          class="btn btn-sm"
          :class="{
            'btn-primary text-white': postStore.filter.date,
            'btn-outline-primary': !postStore.filter.date
          }"
        >
          <div slot="date-target">
            <span v-if="!postStore.filter.date">{{ $l('Date') }}</span>
            <span v-else>{{ $date.toDMY(postStore.filter.date) }}</span>
          </div>
        </ion-datetime-button>
        <types />
        <reactions />
        <tags />
      </div>
    </div>
  </div>
</template>

<script setup>
import { IonToolbar, IonDatetimeButton } from '@ionic/vue';
import Search from './search.vue';
import { usePostStore } from '@/stores/post';
import { ref } from 'vue';
import Reactions from './reactions.vue';
import Tags from './tags.vue';
import Types from './types.vue';

const postStore = usePostStore();

const showFilters = ref(false);
</script>

<style lang="scss">
.filter-bar {
  & > * {
    margin-right: 0.5rem;
  }
  &::-webkit-scrollbar{
    display: none;
  }
}
ion-datetime-button::part(native) {
  background-color: transparent;
  color: inherit;
  padding: 0;
  &:hover {
    color: white;
  }
}
</style>
