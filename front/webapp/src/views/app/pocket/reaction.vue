<style>
  ion-modal#reaction-picker {
    --width: fit-content;
    --min-width: 250px;
    --height: fit-content;
    --border-radius: 6px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  }
  h5.v3-sticky {
    font-size: 14px;
  }
</style>

<template>
  <ion-modal
    :is-open="isOpen"
    id="reaction-picker"
    @didDismiss="isOpen = false"
  >
    <div class="wrapper">
      <EmojiPicker
        :native="true"
        @select="onSelectEmoji"
        :hide-group-icons="true"
        :disable-skin-tones="true"
        :display-recent="true"
        :group-names="{
          smileys_people: 'Emojis',
          animals_nature: '',
          food_drink: '',
          activities: '',
          travel_places: '',
          objects: '',
          symbols: '',
          flags: ''
        }"
      />
    </div>
  </ion-modal>
</template>

<script setup>
import { IonModal, modalController } from '@ionic/vue';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css';
import { usePostStore } from '@/stores/post';
import { onMounted, inject, ref } from 'vue';

const postStore = usePostStore();
const $emitter = inject('$emitter');

const isOpen = ref(false);
const postId = ref(null);

const props = defineProps({
  post: Object,
});

const onSelectEmoji = (emoji) => {
  postStore.edit(postId.value, { emoji: emoji.i });
  modalController.dismiss();
}

onMounted(() => {
  $emitter.on('reaction-modal:open', (id) => {
    if ( !id ) return;
    isOpen.value = true;
    postId.value = id;
  });
})
</script>
