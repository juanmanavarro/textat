<template>
  <ion-list lines="full">
    <ion-item v-if="billingStore.loading">
      <div class="text-center w-100">
        <ion-spinner name="crescent"></ion-spinner>
      </div>
    </ion-item>
    <ion-item v-else class="align-center">
      <ion-label>
        <span v-if="billingStore.selected?.recurring.interval">
          {{ $currency.format(billingStore.selected?.unit_amount / 100) }} / {{ $l(billingStore.selected?.recurring.interval) }}&nbsp;
        </span>
        <span
          v-if="selectYearly"
          class="badge text-bg-danger rounded-0"
        >{{ billingStore.subscriptionSavings }} %</span>
      </ion-label>
      <ion-toggle
        slot="end"
        v-model="selectYearly"
        @ion-change="selectPrice"
      ></ion-toggle>
    </ion-item>
  </ion-list>
  <div class="px-3">
    <button
      class="btn btn-primary w-100 rounded-0 btn-lg"
      @click="showPaymentForm"
    >{{ $l('Activate Premium plan') }}</button>
  </div>
</template>

<script setup>
import {
  IonSpinner,
  IonItem,
  IonLabel,
  IonToggle,
  IonList,
  modalController,
} from '@ionic/vue';
import Payment from './payment.vue';
import { useBillingStore } from '@/stores/billing';
import { ref, inject, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const billingStore = useBillingStore();
const authStore = useAuthStore();
const date = inject('date');

const selectYearly = ref(true);

const selectPrice = () => {
  billingStore.$patch({
    selected: selectYearly.value
      ? billingStore.prices?.[0]
      : billingStore.prices?.[1]
  });
}

const showPaymentForm = async () => {
  const modal = await modalController.create({
    component: Payment,
    cssClass: 'card-modal',
  });
  modal.present();
}

onMounted(() => {
  billingStore.$patch({
    selected: billingStore.prices?.[0],
  });
});
</script>

<style lang="scss">
ion-modal.card-modal::part(content) {
    height: 177px;
    position: absolute;
    bottom: 0;
}
</style>
