<template>
  <input
    class="form-control d-inline"
    type="text"
    :placeholder="$l('Search')"
    :aria-label="$l('Search')"
    v-model="postStore.filter.q"
    @keyup="search"
    ref="searchInput"
    @focus="onFocus"
  >
  <i
    v-if="showClear"
    class="bi bi-x-square fs-4 ms-2 text-danger"
    @click="clearFilter"
  ></i>
</template>

<script setup>
import { ref } from 'vue';
import { usePostStore } from '@/stores/post.js';

const emit = defineEmits(['focus', 'blur']);

const postStore = usePostStore();

const q = ref('');
const searchInput = ref();
const showClear = ref(false);

let timerId;
const search = (e) => {
  searchInput.value.focus();
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    postStore.search({ q: e.target.value });
  }, 500);
};

const clearFilter = () => {
  q.value = null;
  postStore.search(null);
  showClear.value = false;
  emit('blur');
}

const onFocus = () => {
  showClear.value = true;
  emit('focus');
}
</script>
