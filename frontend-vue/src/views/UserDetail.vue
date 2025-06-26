<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Mock de usuarios (igual que en UserList.vue)
const users = [
  {
    id: 1,
    firstName: "Emily",
    lastName: "Johnson",
    maidenName: "Smith",
    age: 28,
    gender: "female",
    email: "emily.johnson@x.dummyjson.com",
    phone: "+81 965-431-3024",
    username: "emilys",
    password: "emilyspass",
    birthDate: "1996-5-30",
    image: "https://dummyjson.com/icon/emilys/128",
    bloodGroup: "O-",
    height: 193.24,
    weight: 63.16,
    eyeColor: "Green",
    hair: { color: "Brown", type: "Curly" },
    ip: "42.48.100.32",
    address: {
      address: "626 Main Street",
      city: "Phoenix",
      state: "Mississippi",
      stateCode: "MS",
      postalCode: "29112",
      coordinates: { lat: -77.16213, lng: -92.084824 },
      country: "United States"
    },
    macAddress: "47:fa:41:18:ec:eb",
    university: "University of Wisconsin--Madison",
    bank: {
      cardExpire: "03/26",
      cardNumber: "9289760655481815",
      cardType: "Elo",
      currency: "CNY",
      iban: "YPUXISOBI7TTHPK2BR3HAIXL"
    },
    company: {
      department: "Engineering",
      name: "Dooley, Kozey and Cronin",
      title: "Sales Manager",
      address: {
        address: "263 Tenth Street",
        city: "San Francisco",
        state: "Wisconsin",
        stateCode: "WI",
        postalCode: "37657",
        coordinates: { lat: 71.814525, lng: -161.150263 },
        country: "United States"
      }
    },
    ein: "977-175",
    ssn: "900-590-289",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
    crypto: {
      coin: "Bitcoin",
      wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
      network: "Ethereum (ERC20)"
    },
    role: "admin",
    disabled: false
  },
];

const user = ref(users.find(u => u.id === Number(route.params.id)));

function disableUser() {
  if (user.value) user.value.disabled = true;
}
</script>

<template>
  <div class="container">
    <h1>Detalle de Usuario</h1>
    <div v-if="user">
      <img :src="user.image" alt="Foto de usuario" width="100" />
      <ul>
        <li><b>ID:</b> {{ user.id }}</li>
        <li><b>Nombre:</b> {{ user.firstName }}</li>
        <li><b>Apellido:</b> {{ user.lastName }}</li>
        <li><b>Maiden Name:</b> {{ user.maidenName }}</li>
        <li><b>Edad:</b> {{ user.age }}</li>
        <li><b>Género:</b> {{ user.gender }}</li>
        <li><b>Email:</b> {{ user.email }}</li>
        <li><b>Teléfono:</b> {{ user.phone }}</li>
        <li><b>Username:</b> {{ user.username }}</li>
        <li><b>Password:</b> {{ user.password }}</li>
        <li><b>Fecha de nacimiento:</b> {{ user.birthDate }}</li>
        <li><b>Grupo sanguíneo:</b> {{ user.bloodGroup }}</li>
        <li><b>Altura:</b> {{ user.height }}</li>
        <li><b>Peso:</b> {{ user.weight }}</li>
        <li><b>Color de ojos:</b> {{ user.eyeColor }}</li>
        <li><b>Pelo:</b> {{ user.hair.color }} ({{ user.hair.type }})</li>
        <li><b>IP:</b> {{ user.ip }}</li>
        <li><b>Dirección:</b> {{ user.address.address }}, {{ user.address.city }}, {{ user.address.state }} ({{ user.address.stateCode }}), {{ user.address.country }}, CP: {{ user.address.postalCode }}</li>
        <li><b>Coordenadas:</b> Lat: {{ user.address.coordinates.lat }}, Lng: {{ user.address.coordinates.lng }}</li>
        <li><b>MAC:</b> {{ user.macAddress }}</li>
        <li><b>Universidad:</b> {{ user.university }}</li>
        <li><b>Banco:</b> {{ user.bank.cardType }} {{ user.bank.cardNumber }} (Expira: {{ user.bank.cardExpire }}, IBAN: {{ user.bank.iban }}, Moneda: {{ user.bank.currency }})</li>
        <li><b>Compañía:</b> {{ user.company.name }} ({{ user.company.department }}, {{ user.company.title }})</li>
        <li><b>Dirección Compañía:</b> {{ user.company.address.address }}, {{ user.company.address.city }}, {{ user.company.address.state }} ({{ user.company.address.stateCode }}), {{ user.company.address.country }}, CP: {{ user.company.address.postalCode }}</li>
        <li><b>Coordenadas Compañía:</b> Lat: {{ user.company.address.coordinates.lat }}, Lng: {{ user.company.address.coordinates.lng }}</li>
        <li><b>EIN:</b> {{ user.ein }}</li>
        <li><b>SSN:</b> {{ user.ssn }}</li>
        <li><b>User Agent:</b> {{ user.userAgent }}</li>
        <li><b>Cripto:</b> {{ user.crypto.coin }} ({{ user.crypto.network }}) - Wallet: {{ user.crypto.wallet }}</li>
        <li><b>Rol:</b> {{ user.role }}</li>
        <li><b>Estado:</b> <span v-if="user.disabled" class="disabled">Deshabilitado</span><span v-else class="enabled">Activo</span></li>
      </ul>
      <button @click="disableUser" :disabled="user.disabled">Deshabilitar usuario</button>
      <button @click="router.push('/usuarios')">Volver al listado</button>
    </div>
    <div v-else>
      <p>Usuario no encontrado.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 0.5rem;
}
.enabled {
  color: green;
}
.disabled {
  color: red;
}
button {
  margin-right: 0.5rem;
  margin-top: 1rem;
}
</style> 