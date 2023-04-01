<template>
  <div
    v-if="postStore.isFilterActive"
    class="d-flex align-items-center justify-content-center h-100 pt-5"
  >
    <div class="text-center">
      <h6>No posts meet the filter</h6>
      <a class="link" @click="postStore.search(null)">Clean filters</a>
    </div>
  </div>
  <div v-else>
    <a
      class="card d-block text-decoration-none text-dark"
      :href="`https://wa.me/${$env.VITE_APP_PHONE}?text=https%3A%2F%2Ftextpocket.com`"
      target="_blank"
    >
      <div class="card-body">
        <div class="mb-2 p-0">
          <small>Touch to share</small>
        </div>
        <div class="d-flex">
          <img style="width:50px" src="@/assets/images/logo.png" alt="" />
          <div class="ms-4">
            <p class="fs-5">TextPocket</p>
            <span class="link">https://textpocket.com</span>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup>
import { usePostStore } from '@/stores/post';
const postStore = usePostStore();
</script>
