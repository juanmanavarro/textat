<template>
  <NuxtLayout name="authed">
    <main class="pt-3 px-3 d-flex align-items-start">
      <UsersList />
      <div class="ms-3" style="min-width:600px">
        <UsersContacts />
      </div>
    </main>
  </NuxtLayout>
</template>
