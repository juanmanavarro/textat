<template>
  <div class="card">
    <div class="card-header d-flex align-items-center justify-content-between">
      <span>Categorías</span>
      <span>
        <a
          v-if="postStore.filter"
          class="link"
          @click="postStore.fetch({ force: true })"
        >
          <i class="bi bi-x"></i>
        </a>
      </span>
    </div>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item d-flex justify-content-between align-items-center cursor-pointer"
        style="height:47px"
        @click="postStore.fetch({ force: true, category: 'no' })"
        :class="{ active: postStore.filter?.category === 'no' }"
      >
        Sin categoría
      </li>
      <Category
        v-for="category in categories"
        :key="category.id"
        :category="category"
        :isActive="category.id === postStore.filter?.category"
      />
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { usePostStore } from '@/stores/post';
import Category from './category.vue';

const categoryStore = useCategoryStore();
const postStore = usePostStore();

const categories = computed(() => categoryStore.sorted);

onMounted(() => {
  categoryStore.fetch();
});
</script>
