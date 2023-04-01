<template>
  <div class="p-2">
    <p>{{ content.text }}</p>
  </div>
</template>

<script setup>
defineProps({
  content: Object,
});
</script>
