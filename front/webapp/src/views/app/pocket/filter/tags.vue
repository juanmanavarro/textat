<template>
  <button
    id="tags-modal"
    class="btn btn-outline-primary btn-sm"
    :class="{ 'btn-primary text-white': postStore.filter.tags?.length }"
    :disabled="!postStore.filterOptions.tags?.length"
  >{{ $l('Tags') }}</button>
  <ion-modal ref="modal" trigger="tags-modal">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <i class="bi bi-x-lg"></i>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $l('Tags') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button
            :strong="true"
            @click="confirm"
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
          v-for="tag in postStore.filterOptions.tags"
          auto-hide="false"
          @click="select(tag._id)"
        >
          <ion-label>
            #{{ tag.label }}
          </ion-label>
          <ion-checkbox
            slot="end"
            :checked="postStore.filter.tags?.includes(tag._id)"
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
const tags = ref([]);

const select = (id) => {
  if ( postStore.filter.tags.includes(id) ) {
    postStore.filter.tags = postStore.filter.tags.filter(c => c !== id);
  } else {
    postStore.filter.tags.push(id);
  }
}

const confirm = () => {
  postStore.search({ tags: postStore.filter.tags });
  modal.value.$el.dismiss();
}

const cancel = async () => {
  await modal.value.$el.dismiss();
  tags.value = [];
}
</script>
