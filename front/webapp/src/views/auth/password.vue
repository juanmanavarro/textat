<template>
  <main>
    <div class="row" style="--bs-gutter-x:0">
      <div class="col-md-4 offset-md-4 px-4" style="padding-top:17vh">
        <h4 class="mb-2">Recupera tu cuenta</h4>
        <form action="">
          <input
            type="text"
            class="form-control"
            :class="{ 'border border-danger': passwordError, 'is-invalid': $v.username.$errors.length }"
            placeholder="Escribe tu usuario..."
            v-model="credentials.username"
            :disabled="sending"
            @keyup="resetLoginError"
            autocomplete="username"
          >
          <div v-if="$v.username.$errors.length" class="text-danger">
            {{ $v.username.$errors[0].$message }}
          </div>
          <small class="text-danger">{{ passwordError }}</small>
          <button
            class="btn btn-primary w-100 mt-2"
            :disabled="!canLogin"
            @click.prevent="send"
          >
            <span v-if="!sending">Enviar código</span>
            <div v-else class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
        </form>
        <RouterLink to="login" class="mt-2 d-inline-block">
          <small>Volver</small>
        </RouterLink>
      </div>
    </div>
  </main>
  <footer class="fixed-bottom p-3 bg-ligth text-dark">
    <div class="row">
      <div class="col-8">
        <span>@ {{ new Date().getFullYear() }}
          <a target="_blank" :href="$env.VITE_LANDING_HOST">{{ $env.VITE_APP_NAME }}</a>
        </span>
      </div>
      <div class="col text-end">
        <a :href="`mailto:${$env.VITE_APP_EMAIL}`" target="_blank">
          <i class="bi bi-envelope-fill"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from '@vuelidate/validators';
import { computed, onMounted, reactive, ref } from 'vue';

const authStore = useAuthStore();

const credentials = reactive({
  username: null,
});
const rules = {
  username: {
    required: helpers.withMessage('El nombre de usuario es obligatorio', required),
  },
};
const $v = useVuelidate(rules, credentials);

const sending    = ref(false);
const passwordError = ref('');

const canLogin = computed(() => {
  return !sending.value && credentials.username;
});

const send = async () => {
  const result = await $v.value.$validate();
  if ( !result ) return;

  sending.value = true;
  await authStore.password(credentials);
  sending.value = false;
};

const resetLoginError = async () => {
  if ( !passwordError.value ) return;
  passwordError.value = null;
}

onMounted(() => {
  if ( authStore.user ) authStore.logout();
});
</script>
