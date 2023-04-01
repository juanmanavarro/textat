<template>
  <slot />
  <span v-show="false">{{ refresh }}</span>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const refresh = ref(false);

onMounted(() => {
  setInterval(() => {
    refresh.value = !refresh.value;
  }, 60000);
});
</script>

<style lang="scss" scoped>

</style>
