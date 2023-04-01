<template>
  <main>
    <div class="row" style="--bs-gutter-x:0">
      <div class="col-md-4 offset-md-4 px-4" style="padding-top:17vh">
        <h4 class="mb-2">{{ $l('Sign in') }}</h4>
        <Account />
        <form action="">
          <input
            type="text"
            class="form-control"
            :class="{ 'border border-danger': loginError, 'is-invalid': $v.username.$errors.length }"
            :placeholder="$l('Username')"
            v-model="credentials.username"
            :disabled="sending"
            @keyup="resetLoginError"
            autocomplete="username"
          >
          <div v-if="$v.username.$errors.length" class="text-danger">
            {{ $v.username.$errors[0].$message }}
          </div>
          <input
            type="password"
            class="form-control mt-2"
            :class="{ 'border border-danger': loginError, 'is-invalid': $v.password.$errors.length }"
            :placeholder="$l('Password')"
            v-model="credentials.password"
            :disabled="sending"
            @keyup="resetLoginError"
            @keyup.enter="send"
            autocomplete="new-password"
          >
          <div v-if="$v.password.$errors.length" class="text-danger">
            {{ $v.password.$errors[0].$message }}
          </div>
          <small class="text-danger">{{ loginError }}</small>
          <button
            class="btn btn-primary w-100 mt-2"
            :disabled="!canLogin"
            @click.prevent="send"
          >
            <span v-if="!sending">{{ $l('Sign in') }}</span>
            <div v-else class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </button>
        </form>
        <!-- <RouterLink to="password" class="mt-2 d-inline-block">
          <small>Olvidé la contraseña</small>
        </RouterLink> -->
      </div>
    </div>
  </main>
  <Footer />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useVuelidate } from "@vuelidate/core";
import { helpers, minLength, required } from '@vuelidate/validators';
import { computed, onMounted, reactive, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import Footer from './footer.vue';
import Account from './account.vue';

const router    = useRouter();
const authStore = useAuthStore();
const $l        = inject('$l');

const credentials = reactive({
  username: null,
  password: null,
});
const rules = {
  username: {
    required: helpers.withMessage($l('The username is required'), required),
  },
  password: {
    required: helpers.withMessage($l('The password is required'), required),
    minLength: helpers.withMessage(
      ({ $params }) => $l('The password must be at least {chars} characters long', { chars: $params.min }),
      minLength(8)
    ),
  },
};
const $v = useVuelidate(rules, credentials);

const sending    = ref(false);
const loginError = ref('');

const canLogin = computed(() => {
  return !sending.value && credentials.username && credentials.password;
});

const send = async () => {
  const result = await $v.value.$validate();
  if ( !result ) return;

  sending.value = true;
  const authed = await authStore.login(credentials);
  sending.value = false;
  if ( typeof authed !== 'string' ) {
    router.replace({ name: 'pocket' });
  } else {
    loginError.value = authed;
  }
};

const resetLoginError = async () => {
  if ( !loginError.value ) return;
  loginError.value = null;
}

onMounted(() => {
  if ( authStore.user ) authStore.logout();
});
</script>
