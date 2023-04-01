<template>
  <div class="bg-light p-5 rounded w-75">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-body">
          <div v-html="$t('register_info')"></div>
          <a
            target="_blank"
            :href="`https://wa.me/34613088292?text=${$t('Hello')}%20`"
            class="float-end mt-3"
          >{{ $t('Accept') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style>
.modal-container {
  background-color: #0000008f;
}
</style>
