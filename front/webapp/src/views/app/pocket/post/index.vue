<template>
  <div class="position-relative border w-100 px-2 pt-2 pb-1">
    <div class="d-flex align-items-center justify-content-between bg-gray-50 rounded-t-md w-full">
      <div class="text-muted">
        <Refresher>
          <small class="badge border text-dark bg-light rounded-0">{{ $l(post.type) }}</small>&nbsp;
          <small class="">{{ $date.toHuman(post.created_at) }}</small>
        </Refresher>
      </div>
      <div @click="$emitter.emit('reaction-modal:open', post.id)">
        <span v-if="post.category" class="emoji">{{ post.category.emoji }}</span>
        <i v-else class="bi bi-emoji-smile" style="color:#0000001f"></i>
      </div>
    </div>
    <div class="py-1 max-h-full h-75 grow overflow-y-auto overflow-x-hidden">
      <Location v-if="post.type === 'location'" :post="post" />
      <Image v-else-if="post.type === 'image'" :post="post" />
      <Video v-else-if="post.type === 'video'" :post="post" />
      <Audio v-else-if="post.type === 'audio'" :post="post" />
      <Document v-else-if="post.type === 'document'" :post="post" />
      <Contact v-else-if="post.type === 'contacts'" :post="post" />
      <Link v-if="post.type === 'link'" :post="post" />
      <p v-else>{{ post.text }}</p>
    </div>
    <div v-if="post.comments.length" class="pt-1">
      <div v-for="comment in post.comments" class="card text-bg-light mb-1">
        <div class="card-body p-2 pt-1">
          <small>{{ comment }}</small>
        </div>
      </div>
    </div>
    <div class="py-1">
      <span
        v-for="tag in post.tags"
        class="badge border bg-primary rounded-0 me-1"
      >
        #{{ tag.label }}
      </span>
    </div>
    <div class="py-1 row">
      <div class="col-10 text-muted">
        <span v-if="post.scheduled_at">
          <i class="bi bi-alarm"></i> <small>{{ $date.fromUnix(post.scheduled_at) }}</small>
        </span>
      </div>
      <div class="col text-end">
        <a
          class="link"
          @click="showActions"
        >
          <i class="bi bi-menu-up"></i>
        </a>
      </div>
    </div>
  </div>

</template>

<script setup>
import {
  actionSheetController,
  toastController,
} from '@ionic/vue';
import { inject } from 'vue';
import { usePostStore } from '@/stores/post';
import Refresher from '@/components/refresher.vue';
import Location from './types/location.vue';
import Image from './types/image.vue';
import Video from './types/video.vue';
import Audio from './types/audio.vue';
import Document from './types/document.vue';
import Contact from './types/contact.vue';
import Link from './types/link.vue';

const postStore = usePostStore();
const $l = inject('$l');

const props = defineProps({
  post: Object,
});

const showActions = async (e) => {
  e.stopPropagation();
  const actionSheet = await actionSheetController.create({
    header: $l('Actions'),
    buttons: [
      {
        text: $l('Delete'),
        role: 'destructive',
        data: {
          action: 'delete',
        },
      },
      // {
      //   text: 'Compartir',
      //   data: {
      //     action: 'share',
      //   },
      // },
      {
        text: $l('Cancel'),
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ],
  });

  await actionSheet.present();
  const { data } = await actionSheet.onDidDismiss();
  if ( data?.action === 'delete' ) {
    const deleted = await postStore.delete(props.post);
    if ( deleted ) {
      const toast = await toastController.create({
        message: 'Mensaje eliminado',
        duration: 3000,
        position: 'bottom',
      });

      await toast.present();
    }
  }
}
</script>
