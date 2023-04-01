<template>
  <div class="card me-3" style="min-width:250px">
    <div class="card-header">
      Usuarios
    </div>
    <ul class="list-group list-group-flush">
      <li
        v-for="user in userStore.users"
        class="list-group-item d-flex justify-content-between"
        :class="{ active: userStore.selected.id === user.id }"
        @click="selectUser(user)"
      >
        <div>
          <p class="mb-0">{{ user.username }}</p>
          <small>{{ $date.toDMY(user.registered_at) }}</small>
        </div>
        <div v-if="user.contacts.length">
          <span class="badge text-bg-secondary">{{ user.contacts.length }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import axios from 'axios';

const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();

const users = ref([]);
const selected = ref({});

const selectUser = (selected) => {
  userStore.$patch({ selected });
}

onMounted(async () => {
  userStore.fetch();
});
</script>
