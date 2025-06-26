<script setup lang="ts">
import { ref, computed } from 'vue';

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

const errors = ref({});

function validateField(field) {
  switch (field) {
    case 'firstName':
      if (!user.value.firstName || user.value.firstName.length < 2) return 'El nombre es obligatorio y debe tener al menos 2 letras.';
      break;
    case 'lastName':
      if (!user.value.lastName || user.value.lastName.length < 2) return 'El apellido es obligatorio y debe tener al menos 2 letras.';
      break;
    case 'maidenName':
      if (!user.value.maidenName || user.value.maidenName.length < 2) return 'El segundo apellido es obligatorio y debe tener al menos 2 letras.';
      break;
    case 'age':
      if (!user.value.age || user.value.age < 0 || user.value.age > 120) return 'Edad inválida.';
      break;
    case 'gender':
      if (!user.value.gender) return 'Selecciona un género.';
      break;
    case 'email':
      if (!user.value.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(user.value.email)) return 'Correo electrónico inválido.';
      break;
    case 'phone':
      if (!user.value.phone || user.value.phone.length < 7) return 'Teléfono inválido.';
      break;
    case 'username':
      if (!user.value.username || user.value.username.length < 3) return 'El usuario debe tener al menos 3 caracteres.';
      break;
    case 'password':
      if (!user.value.password || user.value.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
      break;
    case 'birthDate':
      if (!user.value.birthDate) return 'La fecha de nacimiento es obligatoria.';
      if (new Date(user.value.birthDate) > new Date()) return 'La fecha de nacimiento no puede ser en el futuro.';
      break;
    case 'bloodGroup':
      if (!user.value.bloodGroup) return 'Selecciona un grupo sanguíneo.';
      break;
    case 'height':
      if (!user.value.height || user.value.height < 40 || user.value.height > 250) return 'Altura inválida.';
      break;
    case 'weight':
      if (!user.value.weight || user.value.weight < 2 || user.value.weight > 300) return 'Peso inválido.';
      break;
    case 'eyeColor':
      if (!user.value.eyeColor) return 'Color de ojos obligatorio.';
      break;
    case 'hair.color':
      if (!user.value.hair.color) return 'Color de pelo obligatorio.';
      break;
    case 'hair.type':
      if (!user.value.hair.type) return 'Tipo de pelo obligatorio.';
      break;
    case 'address.address':
      if (!user.value.address.address) return 'Dirección obligatoria.';
      break;
    case 'address.city':
      if (!user.value.address.city) return 'Ciudad obligatoria.';
      break;
    case 'address.state':
      if (!user.value.address.state) return 'Estado obligatorio.';
      break;
    case 'address.postalCode':
      if (!user.value.address.postalCode) return 'Código postal obligatorio.';
      break;
    case 'address.country':
      if (!user.value.address.country) return 'País obligatorio.';
      break;
    case 'address.coordinates.lat':
      if (user.value.address.coordinates.lat === null || user.value.address.coordinates.lat === undefined) return 'Latitud obligatoria.';
      break;
    case 'address.coordinates.lng':
      if (user.value.address.coordinates.lng === null || user.value.address.coordinates.lng === undefined) return 'Longitud obligatoria.';
      break;
    // Puedes agregar más validaciones para los demás campos si lo deseas
    default:
      return '';
  }
  return '';
}

function validateStep() {
  errors.value = {};
  const fieldsByStep = [
    // Paso 1
    ['firstName', 'lastName', 'maidenName', 'age', 'gender', 'email'],
    // Paso 2
    ['phone', 'username', 'password', 'birthDate', 'bloodGroup', 'height'],
    // Paso 3
    ['weight', 'eyeColor', 'hair.color', 'hair.type', 'address.address', 'address.city'],
    // Paso 4
    ['address.state', 'address.postalCode', 'address.country', 'address.coordinates.lat', 'address.coordinates.lng', 'macAddress'],
    // Paso 5
    ['university', 'bank.cardType', 'bank.cardNumber', 'bank.cardExpire', 'bank.iban', 'bank.currency'],
    // Paso 6
    ['company.name', 'company.department', 'company.title', 'company.address.address', 'company.address.city', 'company.address.state'],
    // Paso 7
    ['company.address.postalCode', 'company.address.country', 'company.address.coordinates.lat', 'company.address.coordinates.lng', 'ein', 'ssn'],
    // Paso 8
    ['userAgent', 'crypto.coin', 'crypto.wallet', 'crypto.network', 'role', 'disabled'],
    // Paso 9 (confirmación, sin validación)
    []
  ];
  const fields = fieldsByStep[step.value - 1];
  let valid = true;
  for (const field of fields) {
    let value = field;
    // Soporte para campos anidados
    if (field.includes('.')) {
      value = field.split('.').reduce((o, k) => (o ? o[k] : undefined), user.value);
    } else {
      value = user.value[field];
    }
    const error = validateField(field);
    if (error) {
      errors.value[field] = error;
      valid = false;
    }
  }
  return valid;
}

const isStepValid = computed(() => validateStep());

function nextStep() {
  if (isStepValid.value && step.value < totalSteps) step.value++;
}
function prevStep() {
  if (step.value > 1) step.value--;
}
function saveProfile() {
  if (!isStepValid.value) return;
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
        <div class="form-group"><label>Nombre</label><input v-model="user.firstName" />
          <span class="error" v-if="errors.firstName">{{ errors.firstName }}</span></div>
        <div class="form-group"><label>Apellido</label><input v-model="user.lastName" />
          <span class="error" v-if="errors.lastName">{{ errors.lastName }}</span></div>
        <div class="form-group"><label>Segundo Nombre</label><input v-model="user.maidenName" />
          <span class="error" v-if="errors.maidenName">{{ errors.maidenName }}</span></div>
        <div class="form-group"><label>Edad</label><input v-model="user.age" type="number" />
          <span class="error" v-if="errors.age">{{ errors.age }}</span></div>
        <div class="form-group">
          <label>Género</label>
          <div>
            <label v-for="opt in genderOptions" :key="opt.value" style="margin-right:1rem;">
              <input type="radio" v-model="user.gender" :value="opt.value" /> {{ opt.label }}
            </label>
          </div>
          <span class="error" v-if="errors.gender">{{ errors.gender }}</span>
        </div>
        <div class="form-group"><label>Correo electrónico</label><input v-model="user.email" />
          <span class="error" v-if="errors.email">{{ errors.email }}</span></div>
      </div>
      <!-- Paso 2: Datos personales 2/3 -->
      <div v-if="step === 2">
        <h2>Datos personales (2/3)</h2>
        <div class="form-group"><label>Teléfono</label><input v-model="user.phone" />
          <span class="error" v-if="errors.phone">{{ errors.phone }}</span></div>
        <div class="form-group"><label>Nombre de usuario</label><input v-model="user.username" />
          <span class="error" v-if="errors.username">{{ errors.username }}</span></div>
        <div class="form-group"><label>Contraseña</label><input v-model="user.password" type="text" />
          <span class="error" v-if="errors.password">{{ errors.password }}</span></div>
        <div class="form-group"><label>Fecha de nacimiento</label><input v-model="user.birthDate" type="date" />
          <span class="error" v-if="errors.birthDate">{{ errors.birthDate }}</span></div>
        <div class="form-group"><label>Grupo sanguíneo</label><select v-model="user.bloodGroup"><option v-for="g in bloodGroups" :key="g" :value="g">{{ g }}</option></select>
          <span class="error" v-if="errors.bloodGroup">{{ errors.bloodGroup }}</span></div>
        <div class="form-group"><label>Altura</label><input v-model="user.height" type="number" step="0.01" />
          <span class="error" v-if="errors.height">{{ errors.height }}</span></div>
      </div>
      <!-- Paso 3: Datos personales 3/3 -->
      <div v-if="step === 3">
        <h2>Datos personales (3/3)</h2>
        <div class="form-group"><label>Peso (KG)</label><input v-model="user.weight" type="number" step="0.01" />
          <span class="error" v-if="errors.weight">{{ errors.weight }}</span></div>
        <div class="form-group"><label>Color de ojos</label><input v-model="user.eyeColor" />
          <span class="error" v-if="errors.eyeColor">{{ errors.eyeColor }}</span></div>
        <div class="form-group"><label>Pelo (color)</label><input v-model="user.hair.color" />
          <span class="error" v-if="errors['hair.color']">{{ errors['hair.color'] }}</span></div>
        <div class="form-group"><label>Pelo (tipo)</label><input v-model="user.hair.type" />
          <span class="error" v-if="errors['hair.type']">{{ errors['hair.type'] }}</span></div>
        <div class="form-group"><label>Dirección</label><input v-model="user.address.address" />
          <span class="error" v-if="errors['address.address']">{{ errors['address.address'] }}</span></div>
        <div class="form-group"><label>Ciudad</label><input v-model="user.address.city" />
          <span class="error" v-if="errors['address.city']">{{ errors['address.city'] }}</span></div>
      </div>
      <!-- Paso 4: Ubicación y dirección 2/2 -->
      <div v-if="step === 4">
        <h2>Ubicación y dirección (2/2)</h2>
        <div class="form-group"><label>Estado</label><input v-model="user.address.state" />
          <span class="error" v-if="errors['address.state']">{{ errors['address.state'] }}</span></div>
        <div class="form-group"><label>Código postal</label><input v-model="user.address.postalCode" />
          <span class="error" v-if="errors['address.postalCode']">{{ errors['address.postalCode'] }}</span></div>
        <div class="form-group"><label>País</label><input v-model="user.address.country" />
          <span class="error" v-if="errors['address.country']">{{ errors['address.country'] }}</span></div>
        <div class="form-group"><label>Latitud</label><input v-model="user.address.coordinates.lat" type="number" step="0.00001" />
          <span class="error" v-if="errors['address.coordinates.lat']">{{ errors['address.coordinates.lat'] }}</span></div>
        <div class="form-group"><label>Longitud</label><input v-model="user.address.coordinates.lng" type="number" step="0.00001" />
          <span class="error" v-if="errors['address.coordinates.lng']">{{ errors['address.coordinates.lng'] }}</span></div>
        <div class="form-group"><label>MAC</label><input v-model="user.macAddress" /></div>
      </div>
      <!-- Paso 5: Profesional y bancaria 1/3 -->
      <div v-if="step === 5">
        <h2>Profesional y bancaria (1/3)</h2>
        <div class="form-group"><label>Universidad</label><input v-model="user.university" /></div>
        <div class="form-group"><label>Tipo de banco</label><input v-model="user.bank.cardType" /></div>
        <div class="form-group"><label>Número de banco</label><input v-model="user.bank.cardNumber" /></div>
        <div class="form-group"><label>Expiración del banco</label><input v-model="user.bank.cardExpire" /></div>
        <div class="form-group"><label>Banco (IBAN)</label><input v-model="user.bank.iban" /></div>
        <div class="form-group"><label>Moneda del banco</label><input v-model="user.bank.currency" /></div>
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
        <div class="form-group"><label>Código Postal Compañía</label><input v-model="user.company.address.postalCode" /></div>
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
        <button type="button" @click="nextStep" :disabled="step === totalSteps || !isStepValid">Siguiente</button>
        <button v-if="step === totalSteps" type="submit" :disabled="!isStepValid">Guardar</button>
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
.error {
  color: #e74c3c;
  font-size: 0.95em;
  margin-top: 0.2em;
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