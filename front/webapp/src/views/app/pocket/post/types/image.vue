<template>
  <p v-if="post.title" class="text-truncate">
    <strong>{{ post.title }} <span v-if="post.subtitle">| {{ post.subtitle }}</span></strong>
  </p>
  <div v-viewer.static="{
    button: false,
    navbar: false,
    title: false,
    toolbar: false,
    tooltip: false,
    movable: true,
    zoomable: true,
    rotatable: false,
    scalable: true,
    transition: true,
    fullscreen: false,
    keyboard: false,
  }">
    <img
      class="post-img"
      :src="`data:${post.content.mime_type};base64,${post.content.base64}`"
    >
  </div>
</template>

<script setup>
defineProps({
  post: Object,
});
</script>

<style lang="scss">
.post-img {
  max-height: 300px;
  object-fit: cover;
  width: 100%;
}
</style>
