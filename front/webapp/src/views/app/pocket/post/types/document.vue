<template>
  <a
    :download="post.title"
    :href="`data:${post.content.myme_type};base64,${post.content.base64}`"
    class="d-block text-truncate mt-1 mb-1"
  >
    {{ post.title }}
  </a>
</template>

<script setup>
defineProps({
  post: Object,
});
</script>
