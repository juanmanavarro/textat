<template>
  <Menu />

  <ion-page class="ion-page" id="main-content">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-toggle>
            <ion-button>
              <i class="bi bi-list bi-lg"></i>
            </ion-button>
          </ion-menu-toggle>
        </ion-buttons>
        <ion-title>{{ $env.VITE_APP_NAME }}</ion-title>
      </ion-toolbar>
      <Filter />
      <Date />
    </ion-header>
    <ion-content>
      <div class="container pt-2">
        <div v-if="postStore.loading" class="text-center pt-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <template v-else>
          <NoItems v-if="!postStore.posts.length" />
          <List v-else />
          <Reaction />
          <VideoView />
        </template>
      </div>
      <ion-infinite-scroll @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content :loadingSpinner="false">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonToolbar,
  IonContent,
  IonButton,
  IonMenuToggle,
  IonButtons,
  IonTitle,
  IonHeader,
  IonPage,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/vue';
import { usePostStore } from '@/stores/post';
import { onMounted, ref } from 'vue';
import Filter from './filter/index.vue';
import Date from './filter/date.vue';
import Menu from '../menu/index.vue';
import NoItems from './no-items.vue';
import List from './list.vue';
import Reaction from './reaction.vue';
import VideoView from './post/types/video/view.vue';

const postStore = usePostStore();

const loading = ref(false);

const ionInfinite = async (e) => {
  if ( loading.value ) return;
  loading.value = true;
  await postStore.fetch();
  loading.value = false;
  e.target.complete();
}

onMounted(() => {
  postStore.search(null);
});
</script>

<style lang="scss" scoped>
.square-container {
  display: grid;
  grid-template-columns:repeat(3,1fr);
  grid-gap: 10px;
}
</style>
