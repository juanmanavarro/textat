<template>
  <div>
    <nav class="navbar bg-dark" data-bs-theme="dark">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1 text-light">TextPocket</span>
        <div class="text-light">
          {{ authStore.admin?.email }}
          <i class="bi bi-box-arrow-right"></i>
        </div>
      </div>
    </nav>
    <slot />
  </div>
</template>

<script setup>
const authStore = useAuthStore();
</script>
