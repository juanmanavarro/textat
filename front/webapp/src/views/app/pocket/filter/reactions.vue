<template>
  <button
    id="reactions-modal"
    class="btn btn-outline-primary btn-sm"
    :class="{ 'btn-primary text-white': postStore.filter.categories?.length }"
    :disabled="!postStore.filterOptions.reactions?.length"
  >{{ $l('Reactions') }}</button>
  <ion-modal ref="modal" trigger="reactions-modal">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button @click="cancel">
            <i class="bi bi-x-lg"></i>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $l('Reactions') }}</ion-title>
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
      <ion-list
        v-if="postStore.filterOptions.reactions?.length"
        lines="none"
      >
        <ion-item
          v-for="reaction in postStore.filterOptions.reactions"
          auto-hide="false"
          @click="select(reaction._id)"
        >
          <span class="" slot="start">
            {{ reaction.emoji }}
          </span>
          <ion-label>
            {{ reaction.name || emojiName(reaction.emoji) }}
          </ion-label>
          <ion-checkbox
            slot="end"
            :checked="postStore.filter.categories.includes(reaction._id)"
          ></ion-checkbox>
        </ion-item>
      </ion-list>
      <div v-else class="text-center p-3 mt-5">
        <p class="mb-4">Pressing and holding on a message will bring up a menu of options including a list of emojis that can be selected as a reaction to that message. You can then filter your messages by reaction from here</p>
        <video class="w-75" loop autoplay muted>
          <source src="@/assets/videos/tutos/reaction.ogg" type="video/ogg">
          Your browser does not support the video tag.
        </video>
      </div>
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
import { computed, ref } from 'vue';
import emojis from '@/assets/data/emojis.json';

const postStore = usePostStore();

const modal = ref();
const categories = ref([]);

const emojiName = computed(() => {
  return (emoji) => emojis.find(e => e.emoji === emoji).description;
});

const select = (id) => {
  if ( postStore.filter.categories.includes(id) ) {
    postStore.filter.categories = postStore.filter.categories.filter(c => c !== id);
  } else {
    postStore.filter.categories.push(id);
  }
}

const confirm = () => {
  postStore.search({ categories: postStore.filter.categories });
  modal.value.$el.dismiss();
}

const cancel = async () => {
  await modal.value.$el.dismiss();
  categories.value = [];
}
</script>
