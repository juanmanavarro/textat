export default defineNuxtPlugin(app => {
  const router = useRouter();
  router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();
    await authStore.me();

    if ( to.name === 'index' && authStore.admin ) {
      router.replace('/users');
      return true;
    }
    if ( to.name !== 'index' && !authStore.admin ) {
      await authStore.logout();
      router.replace('/');
      return true;
    }
  });
});
