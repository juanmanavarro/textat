<template>
  <p v-if="post.title" class="text-truncate">
    <strong>{{ post.title }} <span v-if="post.subtitle">| {{ post.subtitle }}</span></strong>
  </p>
  <div class="w-full h-full overflow-y-auto overflow-x-hidden">
    <iframe
      :src="`http://maps.google.com/maps?q=${post.content.latitude},${post.content.longitude}&t=k&z=16&output=embed`"
      class="h-100 w-100"
      style="border:0;"
      allowfullscreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</template>

<script setup>
defineProps({
  post: Object,
});
</script>
