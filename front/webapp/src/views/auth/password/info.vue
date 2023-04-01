<template>
  <main>
    <div class="row" style="--bs-gutter-x:0">
      <div class="col-md-4 offset-md-4 px-4" style="padding-top:17vh">
        <h4 class="mb-2">Recupera tu cuenta</h4>
        <p class="mb-5">Te hemos enviado un mensaje a tu WhatsApp. Puedes cambiar tu contraseña desde allí.</p>
        <a
          :href="`https://wa.me/${$env.VITE_APP_PHONE}`"
          target="_blank"
          class="mt-2 d-block btn btn-primary text-light"
        >
          Ir al WhatsApp
        </a>
        <RouterLink to="/login" class="mt-2 d-block btn btn-link">
          <small>Ir al login</small>
        </RouterLink>
      </div>
    </div>
  </main>
  <Footer />
</template>

<script setup>
import Footer from '../footer.vue';
</script>
