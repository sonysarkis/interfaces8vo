<script setup>
// ...existing code...
</script>

<template>
  <nav style="margin-bottom: 2em;">
    <router-link to="/">Inicio</router-link> |
    <router-link to="/carrusel">Carrusel de Videos</router-link>
  </nav>
  <router-view />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
nav {
  font-size: 1.2em;
  margin-bottom: 2em;
}
nav a {
  color: #42b883;
  text-decoration: none;
  margin: 0 1em;
}
nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
