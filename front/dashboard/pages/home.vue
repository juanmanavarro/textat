<template>
  <NuxtLayout name="authed">
    <main class="pt-3 px-3">
      <div class="list-group" style="width:300px">
        <NuxtLink
          to="/home"
          class="list-group-item list-group-item-action active"
        >Inicio</NuxtLink>
        <NuxtLink
          to="/users"
          class="list-group-item list-group-item-action"
        >Usuarios</NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>
