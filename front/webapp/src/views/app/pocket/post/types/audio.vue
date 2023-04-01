<template>
  <div class="d-flex align-items-center justify-content-center h-full pt-3">
    <audio controls class="w-100">
      <source :src="`data:${post.content.mime_type};base64,${post.content.base64}`" />
      Tu navegador no soporta el audio
    </audio>
  </div>
</template>

<script setup>
defineProps({
  post: Object,
});
</script>
