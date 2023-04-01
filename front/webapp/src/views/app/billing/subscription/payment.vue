<template>
  <ion-content class="ion-padding" color="primary">
    <ion-list lines="full">
      <ion-item>
        <ion-label>{{ $l('Price') }}</ion-label>
        <span slot="end">
          {{ $currency.format(billingStore.selected?.unit_amount / 100) }}
        </span>
      </ion-item>
      <!-- <ion-item>
        <ion-label>Hasta</ion-label>
        <span slot="end">13/01/2024 (anual)</span>
      </ion-item> -->
      <ion-item>
        <div class="w-100 py-2">
          <div :class="{ 'border-danger': validationError }" id="card-element"></div>
          <small v-if="validationError" class="text-danger">{{ validationError }}</small>
        </div>
      </ion-item>
      <ion-item>
        <button
          class="btn btn-primary w-100 rounded-0"
          @click="subscribe"
          :disabled="billingStore.loading"
        >
          <div
            v-if="billingStore.loading"
            class="spinner-border spinner-border-sm"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <span v-else>{{ $l('Activate Premium plan') }}</span>
        </button>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script setup>
import {
    IonContent,
    IonItem,
    IonList,
    IonLabel,
    toastController,
    modalController,
    alertController,
} from '@ionic/vue';
import { onMounted, inject, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import { useWs } from '@/composables/ws';

const $env = inject('$env');
const $l = inject('$l');
const authStore = useAuthStore();
const billingStore = useBillingStore();

const validationError = ref(null);
const paymentClientSecret = ref(null);

let stripe = null;
let cardElement = null;

const subscribe = async () => {
  validationError.value = null;
  if ( !cardElement || !stripe ) return;

  const res = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    metadata: { user_id: authStore.user.id },
  });

  if ( res.error ) {
    validationError.value = res.error.message;
    return;
  }

  const response = await billingStore.create({
    payment_method: res.paymentMethod,
    user: authStore.user,
  });

  if ( response === true ) {
    await modalController.dismiss();
    const toast = await toastController.create({
      message: $l('Premium Plan active. Thank you!'),
      duration: 3000,
    });
    await toast.present();
    return;
  }

  await modalController.dismiss();

  if ( response.payment_client_secret ) {
    paymentClientSecret.value = response.payment_client_secret;
    return;
  }

  const toast = await toastController.create({
    message: response.error,
    duration: 5000,
    cssClass: 'toast-danger',
  });
  await toast.present();
}

onMounted(() => {
  stripe = Stripe($env.VITE_STRIPE_KEY, { locale: 'en' });
  const elements = stripe.elements();
  const elementsStyles = {
    base: {
      color: '#000000',
      iconColor: '#004ABB',
      fontSize: '16px',
      '::placeholder': {
        color: '#959ca9',
      },
    },
    invalid: {
      color: '#ff5252',
      iconColor: '#ff5252',
    },
  };

  cardElement = elements.create('card', {
    style: elementsStyles,
    hidePostalCode: true,
  });
  cardElement.mount('#card-element');

  cardElement.addEventListener('change', () => {});

  const ws = useWs();
  ws.on('stripe:invoice.payment_action_required', async () => {
    stripe
      .confirmCardPayment(paymentClientSecret.value)
      .then(async function(result) {
        if ( result.error ) {
          const toast = await toastController.create({
            message: result.error.message,
            duration: 5000,
            cssClass: 'toast-danger',
          });
          await toast.present();
        }
        // Handle result.error or result.paymentIntent
      });
  });
})
</script>

<style lang="scss" scoped>
#card-element {
  display: block;
  width: 100%;
  padding: 0.7rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.375rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  &:focus {
    color: #212529;
    background-color: #fff;
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 25%);
  }
}
</style>
