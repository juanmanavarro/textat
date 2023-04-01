<template>
  <ion-menu content-id="main-content">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ authStore.user?.username }}</ion-title>
        <ion-buttons slot="end">
          <button
            class="btn btn-link text-white"
            style="padding-top: 10px;"
            @click="logout"
          >
            <i class="bi bi-box-arrow-right bi-lg"></i>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list lines="full">
        <ion-menu-toggle auto-hide="false">
          <ion-item router-link="/subscription">
            <i class="bi bi-star text-warning" slot="start"></i>
            <ion-label v-if="!billingStore.subscription">{{ $l('Go Premium') }}</ion-label>
            <ion-label v-else>{{ $l('Your subscription') }}</ion-label>
          </ion-item>
        </ion-menu-toggle>
        <ion-menu-toggle auto-hide="false">
          <ion-item>
            <i class="bi bi-send text-primary" slot="start"></i>
            <ion-label>
              <a
                class="text-black text-decoration-none"
                :href="`https://wa.me/${$env.VITE_APP_PHONE}?text=/${$l('contact')}%20`"
              >
                {{ $l('Contact') }}
              </a>
            </ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    </ion-content>
  </ion-menu>
</template>

<script setup>
import {
  IonLabel,
  IonItem,
  IonMenuToggle,
  IonList,
  IonMenu,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonContent,
} from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const billingStore = useBillingStore();
const router = useRouter();

const logout = async () => {
  await authStore.logout();
  router.replace({ name: 'login' });
};
</script>
