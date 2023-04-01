<template>
  <ion-app>
    <ion-split-pane when="sm" contentId="main-content">
      <RouterView />
    </ion-split-pane>
  </ion-app>
</template>

<script setup>
import {
  IonSplitPane,
  IonApp,
} from '@ionic/vue';
import { useWsStore } from '@/stores/ws';
import { useBillingStore } from '@/stores/billing';
import { onMounted } from 'vue';

const wsStore = useWsStore();
const billingStore = useBillingStore();

onMounted(() => {
  wsStore.init();
  billingStore.fetch();
});
</script>

<style scoped>
ion-split-pane {
  --side-width: 350px;
  --side-max-width: 350px;
  --border: 1px solid #b3baff;
}
</style>
