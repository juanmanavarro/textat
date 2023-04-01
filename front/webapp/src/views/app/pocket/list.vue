<template>
  <div class="row pb-2">
    <div
      class="col-12 col-md-4 col-lg-4 col-xl-4 mb-2"
      v-for="post in posts"
      :key="post.id"
      :post="post"
    >
      <Post :post="post" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePostStore } from '@/stores/post';
import Post from './post/index.vue';

const postStore = usePostStore();

const posts = computed(() => postStore.posts);
</script>
