<template>
  <a
    @click="presentAlert"
    class="d-block mb-2 link"
  >
    {{ $l("I do not have an account") }}
  </a>
</template>

<script setup>
import { IonButton, alertController } from '@ionic/vue';
import { inject } from 'vue';

const $env = inject('$env');
const $l = inject('$l');

const presentAlert = async () => {
  const alert = await alertController.create({
    header: $l('Welcome to TextPocket!'),
    message: $l("Clicking \"OK\" will open the TextPocket chat in your WhatsApp app. Say hello and follow the instructions to register. By registering you agree to the <a href=\"https://textpocket.com/privacy-policy\" target=\"_blank\">terms and conditions</a> of the application."),
    buttons: [
      {
        text: $l('Accept'),
        handler: (value) => {
          window.open(`https://wa.me/${$env.VITE_APP_PHONE}?text=Hello`, '_blank');
        },
      },
    ],
  });

  await alert.present();
};
</script>
