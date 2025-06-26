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
    name: "Dooley, Kozey y Cronin",
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

const genderOptions = [
  { label: 'Femenino', value: 'female' },
  { label: 'Masculino', value: 'male' }
];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const step = ref(1);
const totalSteps = 9;

function nextStep() {
  if (step.value < totalSteps) step.value++;
}
function prevStep() {
  if (step.value > 1) step.value--;
}
function saveProfile() {
  alert('Perfil guardado (simulado)');
}
</script>

<template>
  <div class="container">
    <h1>Mi Perfil</h1>
    <form @submit.prevent="saveProfile">
      <!-- Paso 1: Datos personales 1/3 -->
      <div v-if="step === 1">
        <h2>Datos personales (1/3)</h2>
        <div class="form-group"><label>Nombre</label><input v-model="user.firstName" /></div>
        <div class="form-group"><label>Apellido</label><input v-model="user.lastName" /></div>
        <div class="form-group"><label>Maiden Name</label><input v-model="user.maidenName" /></div>
        <div class="form-group"><label>Edad</label><input v-model="user.age" type="number" /></div>
        <div class="form-group">
          <label>Género</label>
          <div>
            <label v-for="opt in genderOptions" :key="opt.value" style="margin-right:1rem;">
              <input type="radio" v-model="user.gender" :value="opt.value" /> {{ opt.label }}
            </label>
          </div>
        </div>
        <div class="form-group"><label>Email</label><input v-model="user.email" /></div>
      </div>
      <!-- Paso 2: Datos personales 2/3 -->
      <div v-if="step === 2">
        <h2>Datos personales (2/3)</h2>
        <div class="form-group"><label>Teléfono</label><input v-model="user.phone" /></div>
        <div class="form-group"><label>Username</label><input v-model="user.username" /></div>
        <div class="form-group"><label>Password</label><input v-model="user.password" type="text" /></div>
        <div class="form-group"><label>Fecha de nacimiento</label><input v-model="user.birthDate" type="date" /></div>
        <div class="form-group"><label>Grupo sanguíneo</label><select v-model="user.bloodGroup"><option v-for="g in bloodGroups" :key="g" :value="g">{{ g }}</option></select></div>
        <div class="form-group"><label>Altura</label><input v-model="user.height" type="number" step="0.01" /></div>
      </div>
      <!-- Paso 3: Datos personales 3/3 -->
      <div v-if="step === 3">
        <h2>Datos personales (3/3)</h2>
        <div class="form-group"><label>Peso</label><input v-model="user.weight" type="number" step="0.01" /></div>
        <div class="form-group"><label>Color de ojos</label><input v-model="user.eyeColor" /></div>
        <div class="form-group"><label>Pelo (color)</label><input v-model="user.hair.color" /></div>
        <div class="form-group"><label>Pelo (tipo)</label><input v-model="user.hair.type" /></div>
        <div class="form-group"><label>Dirección</label><input v-model="user.address.address" /></div>
        <div class="form-group"><label>Ciudad</label><input v-model="user.address.city" /></div>
      </div>
      <!-- Paso 4: Ubicación y dirección 2/2 -->
      <div v-if="step === 4">
        <h2>Ubicación y dirección (2/2)</h2>
        <div class="form-group"><label>Estado</label><input v-model="user.address.state" /></div>
        <div class="form-group"><label>CP</label><input v-model="user.address.postalCode" /></div>
        <div class="form-group"><label>País</label><input v-model="user.address.country" /></div>
        <div class="form-group"><label>Latitud</label><input v-model="user.address.coordinates.lat" type="number" step="0.00001" /></div>
        <div class="form-group"><label>Longitud</label><input v-model="user.address.coordinates.lng" type="number" step="0.00001" /></div>
        <div class="form-group"><label>MAC</label><input v-model="user.macAddress" /></div>
      </div>
      <!-- Paso 5: Profesional y bancaria 1/3 -->
      <div v-if="step === 5">
        <h2>Profesional y bancaria (1/3)</h2>
        <div class="form-group"><label>Universidad</label><input v-model="user.university" /></div>
        <div class="form-group"><label>Banco (tipo)</label><input v-model="user.bank.cardType" /></div>
        <div class="form-group"><label>Banco (número)</label><input v-model="user.bank.cardNumber" /></div>
        <div class="form-group"><label>Banco (expira)</label><input v-model="user.bank.cardExpire" /></div>
        <div class="form-group"><label>Banco (IBAN)</label><input v-model="user.bank.iban" /></div>
        <div class="form-group"><label>Banco (moneda)</label><input v-model="user.bank.currency" /></div>
      </div>
      <!-- Paso 6: Profesional y bancaria 2/3 -->
      <div v-if="step === 6">
        <h2>Profesional y bancaria (2/3)</h2>
        <div class="form-group"><label>Compañía</label><input v-model="user.company.name" /></div>
        <div class="form-group"><label>Departamento</label><input v-model="user.company.department" /></div>
        <div class="form-group"><label>Título</label><input v-model="user.company.title" /></div>
        <div class="form-group"><label>Dirección Compañía</label><input v-model="user.company.address.address" /></div>
        <div class="form-group"><label>Ciudad Compañía</label><input v-model="user.company.address.city" /></div>
        <div class="form-group"><label>Estado Compañía</label><input v-model="user.company.address.state" /></div>
      </div>
      <!-- Paso 7: Profesional y bancaria 3/3 -->
      <div v-if="step === 7">
        <h2>Profesional y bancaria (3/3)</h2>
        <div class="form-group"><label>CP Compañía</label><input v-model="user.company.address.postalCode" /></div>
        <div class="form-group"><label>País Compañía</label><input v-model="user.company.address.country" /></div>
        <div class="form-group"><label>Latitud Compañía</label><input v-model="user.company.address.coordinates.lat" type="number" step="0.00001" /></div>
        <div class="form-group"><label>Longitud Compañía</label><input v-model="user.company.address.coordinates.lng" type="number" step="0.00001" /></div>
        <div class="form-group"><label>EIN</label><input v-model="user.ein" /></div>
        <div class="form-group"><label>SSN</label><input v-model="user.ssn" /></div>
      </div>
      <!-- Paso 8: Seguridad y otros datos 1/2 -->
      <div v-if="step === 8">
        <h2>Seguridad y otros datos (1/2)</h2>
        <div class="form-group"><label>User Agent</label><input v-model="user.userAgent" /></div>
        <div class="form-group"><label>Cripto (moneda)</label><input v-model="user.crypto.coin" /></div>
        <div class="form-group"><label>Cripto (wallet)</label><input v-model="user.crypto.wallet" /></div>
        <div class="form-group"><label>Cripto (network)</label><input v-model="user.crypto.network" /></div>
        <div class="form-group"><label>Rol</label><input v-model="user.role" /></div>
        <div class="form-group"><label>Estado</label><input v-model="user.disabled" type="checkbox" /> Deshabilitado</div>
      </div>
      <!-- Paso 9: Confirmación -->
      <div v-if="step === 9">
        <h2>Confirmar y guardar</h2>
        <p>Revisa tus datos y haz clic en Guardar para finalizar.</p>
      </div>
      <div class="wizard-nav">
        <button type="button" @click="prevStep" :disabled="step === 1">Anterior</button>
        <button type="button" @click="nextStep" :disabled="step === totalSteps">Siguiente</button>
        <button v-if="step === totalSteps" type="submit">Guardar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
button {
  margin-top: 1rem;
  margin-right: 0.5rem;
}
.wizard-nav {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style> 