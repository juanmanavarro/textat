<template>
  <button
    id="types-modal"
    class="btn btn-outline-primary btn-sm"
    :class="{ 'btn-primary text-white': postStore.filter.types?.length }"
  >{{ $l('Types') }}</button>
  <ion-modal ref="modal" trigger="types-modal">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <i class="bi bi-x-lg"></i>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $l('Types') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            :strong="true"
            @click="confirm()"
            class="font-bold text-success"
          >
            <i class="bi bi-check-lg"></i>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list lines="none">
        <ion-item
          v-for="ty in postStore.filterOptions.types"
          auto-hide="false"
          @click="select(ty)"
        >
          <ion-label
            style="text-transform: capitalize;"
          >
            {{ $l(ty) }}
          </ion-label>
          <ion-checkbox
            slot="end"
            :checked="postStore.filter.types.includes(ty)"
          ></ion-checkbox>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonList,
} from '@ionic/vue';
import { usePostStore } from '@/stores/post';
import { ref } from 'vue';

const postStore = usePostStore();

const modal = ref();

const select = (id) => {
  if ( postStore.filter.types.includes(id) ) {
    postStore.filter.types = postStore.filter.types.filter(c => c !== id);
  } else {
    postStore.filter.types.push(id);
  }
}

const confirm = () => {
  postStore.search({ types: postStore.filter.types });
  modal.value.$el.dismiss();
}

const cancel = async () => {
  await modal.value.$el.dismiss();
}
</script>
