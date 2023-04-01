<template>
  <div class="card">
    <div class="card-header">
      {{ userStore.selected.username }}
    </div>
    <div class="card-body">
      <span v-if="!userStore.selected.contacts?.length">
        Este usuario aún no ha contactado
      </span>
      <UsersContactsContact
        v-for="contact in userStore.selected.contacts"
        :contact="contact"
      />
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();

const response = ref("");

const sendResponse = (id) => {
  console.log(response);
  userStore.contact(id, response.valuea);
};
</script>
