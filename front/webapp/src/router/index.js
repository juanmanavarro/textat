import { createRouter, createWebHistory } from '@ionic/vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '../views/auth/login.vue';
import Password from '../views/auth/password/index.vue';
import Info from '../views/auth/password/info.vue';

import App from '../views/app/index.vue';
import Pocket from '../views/app/pocket/index.vue';
import Subscription from '../views/app/billing/index.vue';

let routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { auth: false },
  },
  {
    path: '/password',
    name: 'password',
    component: Password,
    meta: { auth: false },
  },
  {
    path: '/password/info',
    name: 'password.info',
    component: Info,
    meta: { auth: false },
  },
  {
    path: '/',
    component: App,
    meta: { auth: true },
    children: [
      {
        path: '/pocket',
        name: 'pocket',
        component: Pocket,
      },
      {
        path: '/subscription',
        name: 'subscription',
        component: Subscription,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.me();

  if ( !to.meta.auth && authStore.user ) {
    router.replace({ name: 'pocket' });
    return true;
  }
  if ( to.meta.auth && !authStore.user ) {
    await authStore.logout();
    router.replace({ name: 'login' });
    return true;
  }
});

export default router;
