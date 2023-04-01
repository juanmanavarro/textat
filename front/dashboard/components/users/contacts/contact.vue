<template>
  <div class="card mb-2">
    <div class="card-body">
      <small class="text-muted">{{ $date.toHuman(contact.created_at) }}</small>
      <p>{{ contact.message }}</p>
      <template v-if="contact.response">
        <small class="text-muted">
          {{ $date.toHuman(contact.answered_at) }} por {{ contact.admin?.email }}
        </small>
        <p>{{ contact.response }}</p>
      </template>
      <template v-else>
        <textarea class="form-control mb-3" rows="3" v-model="response"></textarea>
        <p class="mb-0 text-end">
          <button
            @click="sendResponse(contact.id)"
            class="btn btn-primary"
            :disabled="!response"
          >Enviar</button>
        </p>
      </template>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();

const props = defineProps({
  contact: Object,
});

const response = ref('');

const sendResponse = (id) => {
  userStore.contact(id, response.value);
}
</script>
