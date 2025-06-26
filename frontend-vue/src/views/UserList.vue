<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const users = ref([
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
  // Puedes agregar más usuarios aquí si lo deseas
]);

function goToDetail(id: number) {
  router.push(`/usuarios/${id}`);
}

function disableUser(id: number) {
  const user = users.value.find(u => u.id === id);
  if (user) user.disabled = true;
}
</script>

<template>
  <div class="container">
    <h1>Listado de Usuarios</h1>
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <span v-if="user.disabled" class="disabled">Deshabilitado</span>
            <span v-else class="enabled">Activo</span>
          </td>
          <td>
            <button @click="goToDetail(user.id)">Ver Detalles</button>
            <button @click="disableUser(user.id)" :disabled="user.disabled">Deshabilitar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.user-table {
  width: 100%;
  border-collapse: collapse;
}
.user-table th, .user-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
.user-table th {
  background: var(--color-primary);
  color: var(--color-background);
}
.enabled {
  color: green;
}
.disabled {
  color: red;
}
button {
  margin-right: 0.5rem;
}
</style> 