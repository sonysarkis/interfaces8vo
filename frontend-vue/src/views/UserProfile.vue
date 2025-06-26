<script setup lang="ts">
import { ref } from 'vue';

const user = ref({
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
});

function saveProfile() {
  alert('Perfil guardado (simulado)');
}
</script>

<template>
  <div class="container">
    <h1>Mi Perfil</h1>
    <form @submit.prevent="saveProfile">
      <img :src="user.image" alt="Foto de usuario" width="100" />
      <div class="form-group">
        <label>ID</label>
        <input v-model="user.id" type="number" disabled />
      </div>
      <div class="form-group">
        <label>Nombre</label>
        <input v-model="user.firstName" />
      </div>
      <div class="form-group">
        <label>Apellido</label>
        <input v-model="user.lastName" />
      </div>
      <div class="form-group">
        <label>Maiden Name</label>
        <input v-model="user.maidenName" />
      </div>
      <div class="form-group">
        <label>Edad</label>
        <input v-model="user.age" type="number" />
      </div>
      <div class="form-group">
        <label>Género</label>
        <input v-model="user.gender" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="user.email" />
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input v-model="user.phone" />
      </div>
      <div class="form-group">
        <label>Username</label>
        <input v-model="user.username" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="user.password" type="text" />
      </div>
      <div class="form-group">
        <label>Fecha de nacimiento</label>
        <input v-model="user.birthDate" type="date" />
      </div>
      <div class="form-group">
        <label>Grupo sanguíneo</label>
        <input v-model="user.bloodGroup" />
      </div>
      <div class="form-group">
        <label>Altura</label>
        <input v-model="user.height" type="number" step="0.01" />
      </div>
      <div class="form-group">
        <label>Peso</label>
        <input v-model="user.weight" type="number" step="0.01" />
      </div>
      <div class="form-group">
        <label>Color de ojos</label>
        <input v-model="user.eyeColor" />
      </div>
      <div class="form-group">
        <label>Pelo (color)</label>
        <input v-model="user.hair.color" />
      </div>
      <div class="form-group">
        <label>Pelo (tipo)</label>
        <input v-model="user.hair.type" />
      </div>
      <div class="form-group">
        <label>IP</label>
        <input v-model="user.ip" />
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input v-model="user.address.address" />
      </div>
      <div class="form-group">
        <label>Ciudad</label>
        <input v-model="user.address.city" />
      </div>
      <div class="form-group">
        <label>Estado</label>
        <input v-model="user.address.state" />
      </div>
      <div class="form-group">
        <label>State Code</label>
        <input v-model="user.address.stateCode" />
      </div>
      <div class="form-group">
        <label>CP</label>
        <input v-model="user.address.postalCode" />
      </div>
      <div class="form-group">
        <label>País</label>
        <input v-model="user.address.country" />
      </div>
      <div class="form-group">
        <label>Latitud</label>
        <input v-model="user.address.coordinates.lat" type="number" step="0.00001" />
      </div>
      <div class="form-group">
        <label>Longitud</label>
        <input v-model="user.address.coordinates.lng" type="number" step="0.00001" />
      </div>
      <div class="form-group">
        <label>MAC</label>
        <input v-model="user.macAddress" />
      </div>
      <div class="form-group">
        <label>Universidad</label>
        <input v-model="user.university" />
      </div>
      <div class="form-group">
        <label>Banco (tipo)</label>
        <input v-model="user.bank.cardType" />
      </div>
      <div class="form-group">
        <label>Banco (número)</label>
        <input v-model="user.bank.cardNumber" />
      </div>
      <div class="form-group">
        <label>Banco (expira)</label>
        <input v-model="user.bank.cardExpire" />
      </div>
      <div class="form-group">
        <label>Banco (IBAN)</label>
        <input v-model="user.bank.iban" />
      </div>
      <div class="form-group">
        <label>Banco (moneda)</label>
        <input v-model="user.bank.currency" />
      </div>
      <div class="form-group">
        <label>Compañía</label>
        <input v-model="user.company.name" />
      </div>
      <div class="form-group">
        <label>Departamento</label>
        <input v-model="user.company.department" />
      </div>
      <div class="form-group">
        <label>Título</label>
        <input v-model="user.company.title" />
      </div>
      <div class="form-group">
        <label>Dirección Compañía</label>
        <input v-model="user.company.address.address" />
      </div>
      <div class="form-group">
        <label>Ciudad Compañía</label>
        <input v-model="user.company.address.city" />
      </div>
      <div class="form-group">
        <label>Estado Compañía</label>
        <input v-model="user.company.address.state" />
      </div>
      <div class="form-group">
        <label>State Code Compañía</label>
        <input v-model="user.company.address.stateCode" />
      </div>
      <div class="form-group">
        <label>CP Compañía</label>
        <input v-model="user.company.address.postalCode" />
      </div>
      <div class="form-group">
        <label>País Compañía</label>
        <input v-model="user.company.address.country" />
      </div>
      <div class="form-group">
        <label>Latitud Compañía</label>
        <input v-model="user.company.address.coordinates.lat" type="number" step="0.00001" />
      </div>
      <div class="form-group">
        <label>Longitud Compañía</label>
        <input v-model="user.company.address.coordinates.lng" type="number" step="0.00001" />
      </div>
      <div class="form-group">
        <label>EIN</label>
        <input v-model="user.ein" />
      </div>
      <div class="form-group">
        <label>SSN</label>
        <input v-model="user.ssn" />
      </div>
      <div class="form-group">
        <label>User Agent</label>
        <input v-model="user.userAgent" />
      </div>
      <div class="form-group">
        <label>Cripto (moneda)</label>
        <input v-model="user.crypto.coin" />
      </div>
      <div class="form-group">
        <label>Cripto (wallet)</label>
        <input v-model="user.crypto.wallet" />
      </div>
      <div class="form-group">
        <label>Cripto (network)</label>
        <input v-model="user.crypto.network" />
      </div>
      <div class="form-group">
        <label>Rol</label>
        <input v-model="user.role" />
      </div>
      <div class="form-group">
        <label>Estado</label>
        <input v-model="user.disabled" type="checkbox" /> Deshabilitado
      </div>
      <button type="submit">Guardar</button>
    </form>
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
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 0.2rem;
}
input[type="checkbox"] {
  width: auto;
  margin-top: 0.5rem;
}
button {
  margin-top: 1rem;
}
</style> 