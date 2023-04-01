<template>
  <ion-toolbar class="pb-2">
    <ActiveSubscription v-if="isActive" />
    <NoSubscription v-else />
  </ion-toolbar>
</template>

<script setup>
import { IonToolbar } from '@ionic/vue';
import { useBillingStore } from '@/stores/billing';
import NoSubscription from './no.vue';
import ActiveSubscription from './active.vue';
import { computed } from 'vue';

const billingStore = useBillingStore();

const isActive = computed(() => {
  if ( !billingStore.subscription ) return false;
  return ['active', 'trialing'].includes(billingStore.subscription.status);
});
</script>
