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
            @keyup="resetPasswordError"
            autocomplete="username"
          >
          <div v-if="$v.username.$errors.length" class="text-danger">
            {{ $v.username.$errors[0].$message }}
          </div>
          <small class="text-danger">{{ passwordError }}</small>
          <button
            class="btn btn-primary w-100 mt-2"
            :disabled="!canSend"
            @click.prevent="send"
          >
            <span v-if="!sending">Recuperar</span>
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
  <Footer />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useVuelidate } from "@vuelidate/core";
import { helpers, required } from '@vuelidate/validators';
import { computed, onMounted, reactive, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import Footer from '../footer.vue';

const router    = useRouter();
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

const canSend = computed(() => {
  return !sending.value && credentials.username;
});

const send = async () => {
  const result = await $v.value.$validate();
  if ( !result ) return;

  sending.value = true;
  const success = await authStore.password(credentials);
  sending.value = false;

  if ( success ) {
    router.replace('password/info');
  }
};

const resetPasswordError = async () => {
  if ( !passwordError.value ) return;
  passwordError.value = null;
}

onMounted(() => {
  if ( authStore.user ) authStore.logout();
});
</script>
