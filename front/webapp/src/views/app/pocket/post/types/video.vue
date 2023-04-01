<template>
  <p v-if="post.title" class="text-truncate">
    <strong>{{ post.title }} <span v-if="post.subtitle">| {{ post.subtitle }}</span></strong>
  </p>
  <a
    class="video-wrapper"
    @click="$emitter.emit('post:video:open', post)"
  >
    <i class="bi bi-play-circle-fill"></i>
    <video class="video-poster">
      <source :src="`data:${post?.content.mime_type};base64,${post?.content.base64}`" />
      Tu navegador no soporta el video
    </video>
  </a>
</template>

<script setup>
const props = defineProps({
  post: Object,
});
</script>

<style scoped>
.video-wrapper {
  position: relative;
  display:flex;
  align-items:center;
  justify-content:center;
}
.video-poster {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}
.bi-play-circle-fill {
  position: absolute;
  font-size: 3rem;
  color: white;
}
</style>
