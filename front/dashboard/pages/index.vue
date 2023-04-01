<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 100vh"
  >
    <div class="w-25" style="max-width:300px;min-width:300px">
      <div class="mb-2">
        <input
          type="email"
          class="form-control"
          placeholder="Email"
          v-model="credentials.email"
        >
      </div>
      <div class="mb-2">
        <input
          type="password"
          class="form-control"
          placeholder="Contraseña"
          v-model="credentials.password"
        >
      </div>
      <div class="mb-2">
        <button class="btn btn-primary w-100" @click="login">Acceder</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const useAuth = useAuthStore();
const router = useRouter();

const credentials = reactive({
  email: '',
  password: '',
});

const login = async () => {
  const res = await useAuth.login(credentials);
  if ( res ) {
    router.replace('/users');
    return;
  }
};
</script>
