<template>
  <p v-if="post.title" class="text-truncate">
    <strong>{{ post.title }}</strong>
  </p>
  <ul class="mt-2">
    <li v-for="phone in post.content?.phones">
      {{ phone.type }}: {{ phone.phone }}
    </li>
  </ul>
</template>

<script setup>
defineProps({
  post: Object,
});
</script>
