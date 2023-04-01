<template>
  <header class="wrapper" style="height:83px">
      <nav class="pt-0 h-100 navbar navbar-expand-lg center-nav transparent navbar-light caret-none">
        <div class="container flex-lg-row flex-nowrap align-items-center">
          <div class="navbar-brand w-75">
            <NuxtLink
              class="fs-30 text-primary"
              style="font-family: 'Righteous', cursive;"
              to="/"
            >TextPocket</NuxtLink>
          </div>
          <a href="https://app.textpocket.com" target="_blank">{{ $t('Sign in') }}</a>
        </div>
      </nav>
    </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
