<template>
  <a
    v-if="showCard"
    :href="post.link"
    class="embedly-card"
    :data-card-key="$env.VITE_EMBEDLY_KEY"
  >Embedly</a>
  <template v-else>
    <div v-if="post.title">
      <p class="text-truncate">
        <strong v-if="post.subtitle">{{ post.subtitle }}</strong>
      </p>
      <small>{{ post.title }}</small>
    </div>
    <a
      v-if="post.link"
      :href="post.link"
      target="_blank"
      class="d-block text-truncate mt-1 mb-1"
    >
      {{ post.link }}
    </a>
    <p>{{ post.text }}</p>
  </template>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  post: Object,
});

const showCard = computed(() => {
  return [
    'twitter.com',
  ].includes(props.post.title);
});
</script>

<style lang="scss" scoped>

</style>
