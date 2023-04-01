<template>
  <footer class="bg-dark text-inverse">
    <div class="container py-5">
      <div class="row">
        <div class="col">
          <p class="m-0">© {{ new Date().getFullYear() }} TextAt</p>
        </div>
        <div class="col text-end">
          <NuxtLink to="/privacy-policy">{{ $t('Privacy policy') }}</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
