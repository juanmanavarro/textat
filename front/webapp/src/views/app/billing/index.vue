<template>
  <ion-page class="ion-page" id="main-content">
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="pocket"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ $env.VITE_APP_NAME }} Premium</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list lines="full">
        <ion-list-header>
          <h6>{{ $l('Advantages of the Premium plan') }}</h6>
        </ion-list-header>
        <ion-item>
          <i class="bi bi-sign-no-parking text-lg" slot="start" style="font-size:25px"></i>
          <ion-label>
            <h2>{{ $l('No advertising') }}</h2>
            <p>{{ $l('Enjoy a smooth user experience') }}</p>
          </ion-label>
        </ion-item>
        <ion-item>
          <i class="bi bi-alarm text-lg" slot="start" style="font-size:25px"></i>
          <ion-label>
            <h2>{{ $l('Program reminders') }}</h2>
            <p>{{ $l('Remember important tasks and events') }}</p>
          </ion-label>
        </ion-item>
        <!-- <ion-item>
          <i class="bi bi-body-text text-lg" slot="start" style="font-size:25px"></i>
          <ion-label>
            <h2>Transcribe mensajes de voz</h2>
            <p>Guarda la versión escrita del mensaje</p>
          </ion-label>
        </ion-item> -->
      </ion-list>
    </ion-content>
    <ion-footer>
      <Subscription />
    </ion-footer>
  </ion-page>
</template>

<script setup>
import {
  IonBackButton,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonContent,
  IonPage,
  IonFooter,
  IonHeader,
  IonListHeader,
  IonLabel,
  IonItem,
  IonList,
} from '@ionic/vue';
import { onMounted } from 'vue';
import { useBillingStore } from '@/stores/billing';
import Subscription from './subscription/index.vue';

const billingStore = useBillingStore();

onMounted(() => {
  billingStore.fetchPrices();
});
</script>
