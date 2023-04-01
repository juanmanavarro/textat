<template>
  <ion-list lines="full">
    <ion-item v-if="billingStore.loading">
      <div class="text-center w-100">
        <ion-spinner name="crescent"></ion-spinner>
      </div>
    </ion-item>
    <ion-item v-else class="align-center">
      <ion-label>
        <template v-if="billingStore.subscription.status === 'active'">
          <strong v-if="!billingStore.subscription.cancel_at_period_end">{{ $l('Renewal date') }}</strong>
          <strong v-else>{{ $l('Date of cancellation') }}</strong>
        </template>
        <strong v-else>{{ $l('On trial until') }}</strong>
        <p>{{ $date.toDMY(billingStore.subscription.ends_at) }}</p>
      </ion-label>
      <a
        v-if="billingStore.subscription.cancel_at_period_end"
        class="text-primary text-decoration-none"
        @click="reactivate"
      >
        {{ $l('Activate') }}
      </a>
      <a
        v-else
        class="text-danger text-decoration-none"
        @click="cancel"
      >
        {{ $l('Cancel') }}
      </a>
    </ion-item>
  </ion-list>
</template>

<script setup>
import {
  IonSpinner,
  IonItem,
  IonLabel,
  IonToggle,
  IonList,
  IonToolbar,
  modalController,
  alertController,
} from '@ionic/vue';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import NoSubscription from './no.vue';
import ActiveSubscription from './active.vue';
import { inject } from 'vue';

const authStore = useAuthStore();
const billingStore = useBillingStore();
const $l = inject('$l');

const cancel = async () => {
  const alert = await alertController.create({
    header: $l('Cancel subscription?'),
    buttons: [
      {
        text: $l('No'),
        role: 'cancel',
      },
      {
        text: $l('Yes, cancel'),
        role: 'confirm',
        handler: () => {
          billingStore.update(true);
        },
      },
    ],
  });

  await alert.present();
}

const reactivate = async () => {
  await billingStore.update(false);
}
</script>

<style lang="scss" scoped>
.button {
  padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x);
}
</style>
