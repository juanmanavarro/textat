<template>
  <footer class="fixed-bottom p-3 bg-ligth text-dark">
    <div class="row">
      <div class="col-8">
        <span>@ {{ new Date().getFullYear() }}
          <a target="_blank" :href="$env.VITE_LANDING_HOST">{{ $env.VITE_APP_NAME }}</a>
        </span>
      </div>
      <div class="col text-end">
        <a :href="`mailto:${$env.VITE_APP_EMAIL}`" target="_blank">
          <i class="bi bi-envelope-fill fs-6"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup></script>
