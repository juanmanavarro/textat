<template>
  <ion-modal
    :is-open="isOpen"
    id="video-view"
    @didDismiss="isOpen = false"
  >
    <i
      @click="isOpen = false"
      class="bi bi-x-lg position-absolute fs-1 text-white"
      style="right:5px;z-index:1"
    ></i>
    <div class="wrapper" style="margin-bottom: -7px;">
      <video controls class="w-100">
        <source :src="`data:${post?.content.mime_type};base64,${post?.content.base64}`" />
        Tu navegador no soporta el video
      </video>
    </div>
  </ion-modal>
</template>

<script setup>
import {
  IonModal,
} from '@ionic/vue';
import { onMounted, inject, ref } from 'vue';

const $emitter = inject('$emitter');

const isOpen = ref(false);
const post = ref(null);

onMounted(() => {
  $emitter.on('post:video:open', data => {
    post.value = data;
    isOpen.value = true;
  });
});
</script>

<style scoped>
ion-modal#video-view {
  --width: fit-content;
  --min-width: 250px;
  --max-width: 90%;
  --height: fit-content;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}
</style>
