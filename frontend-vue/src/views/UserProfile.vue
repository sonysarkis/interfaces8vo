<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// Variables para el mapa
let map: L.Map | null = null;
let marker: L.Marker | null = null;
let searchControl: any = null;

const showModal = ref(false);

// Función para inicializar el mapa
async function initMap() {
  if (map) return;
  
  await nextTick();
  
  // Capas base
  const calleLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  const sateliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri'
    }
  );

  // Inicializa el mapa con la capa de calles
  map = L.map('map', {
    center: [user.value.address.coordinates.lat || 0, user.value.address.coordinates.lng || 0],
    zoom: 13,
    layers: [calleLayer]
  });

  // Control de capas
  L.control.layers(
    {
      'Calles': calleLayer,
      'Satélite': sateliteLayer
    }
  ).addTo(map);
  
  // Crear marcador inicial
  if (user.value.address.coordinates.lat && user.value.address.coordinates.lng) {
    marker = L.marker([user.value.address.coordinates.lat, user.value.address.coordinates.lng]).addTo(map);
  }
  
  // Evento de clic en el mapa
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    
    // Actualizar coordenadas
    user.value.address.coordinates.lat = lat;
    user.value.address.coordinates.lng = lng;
    
    // Actualizar marcador
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      marker = L.marker([lat, lng]).addTo(map!);
    }
    
    // Obtener dirección completa desde coordenadas
    await getAddressFromCoordinates(lat, lng);
  });
  
  // Agregar control de búsqueda
  addSearchControl();
}

// Función para agregar control de búsqueda
function addSearchControl() {
  if (!map) return;
  
  // Crear control de búsqueda personalizado
  const searchControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    
    onAdd: function() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      container.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
          <input type="text" id="search-input" placeholder="Buscar ubicación..." 
                 style="width: 200px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
          <button id="search-btn" style="margin-left: 5px; padding: 5px 10px; background: var(--color-primary); color: white; border: none; border-radius: 3px; cursor: pointer;">
            Buscar
          </button>
        </div>
      `;
      
      const searchInput = container.querySelector('#search-input') as HTMLInputElement;
      const searchBtn = container.querySelector('#search-btn') as HTMLButtonElement;
      
      // Evento de búsqueda
      const performSearch = async () => {
        const query = searchInput.value.trim();
        if (query) {
          await searchLocation(query);
        }
      };
      
      searchBtn.addEventListener('click', performSearch);
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
      
      return container;
    }
  });
  
  map.addControl(new searchControl());
}

// Función para buscar ubicación
async function searchLocation(query: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      
      // Actualizar coordenadas
      user.value.address.coordinates.lat = lat;
      user.value.address.coordinates.lng = lng;
      
      // Actualizar marcador
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map!);
      }
      
      // Centrar mapa
      map!.setView([lat, lng], 15);
      
      // Obtener dirección detallada
      await getAddressFromCoordinates(lat, lng);
    }
  } catch (error) {
    console.error('Error buscando ubicación:', error);
  }
}

// Función para obtener dirección completa desde coordenadas
async function getAddressFromCoordinates(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    const data = await response.json();
    
    if (data.address) {
      const address = data.address;
      
      // Extraer y asignar todos los campos de dirección automáticamente
      user.value.address.address = [
        address.house_number,
        address.road,
        address.suburb
      ].filter(Boolean).join(' ');
      
      user.value.address.city = address.city || address.town || address.village || address.county || '';
      user.value.address.state = address.state || address.province || '';
      user.value.address.stateCode = address.state_code || '';
      user.value.address.postalCode = address.postcode || '';
      user.value.address.country = address.country || '';
    }
  } catch (error) {
    console.error('Error obteniendo dirección:', error);
  }
}

// Función para actualizar mapa cuando cambian las coordenadas manualmente
function updateMapFromCoordinates() {
  if (!map || !user.value.address.coordinates.lat || !user.value.address.coordinates.lng) return;
  
  const lat = user.value.address.coordinates.lat;
  const lng = user.value.address.coordinates.lng;
  
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }
  
  map.setView([lat, lng], 15);
}

// Observar cambios en el paso para inicializar el mapa
const currentStep = computed(() => step.value);

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
  if (isStepValid.value && step.value < totalSteps) {
    step.value++;
    // Inicializar mapa cuando llegamos al paso 4
    if (step.value === 4) {
      nextTick(() => {
        initMap();
      });
    }
  }
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
      <!-- Paso 4: Ubicación y dirección con mapa -->
      <div v-if="step === 4" class="solo-mapa">
        <div id="map" class="map"></div>
        <button type="button" class="info-btn" @click="showModal = true">
          Ver información de ubicación
        </button>
        <!-- Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content">
            <h2>Información de ubicación</h2>
            <div class="info-group">
              <label>Latitud</label>
              <div class="readonly-field">{{ user.address.coordinates.lat || 'No seleccionada' }}</div>
            </div>
            <div class="info-group">
              <label>Longitud</label>
              <div class="readonly-field">{{ user.address.coordinates.lng || 'No seleccionada' }}</div>
            </div>
            <div class="info-group">
              <label>Dirección MAC</label>
              <input v-model="user.macAddress" placeholder="Ej: 47:fa:41:18:ec:eb" />
            </div>
            <div class="info-group">
              <label>Dirección</label>
              <div class="readonly-field">{{ user.address.address || 'No seleccionada' }}</div>
            </div>
            <div class="info-group">
              <label>Ciudad</label>
              <div class="readonly-field">{{ user.address.city || 'No seleccionada' }}</div>
            </div>
            <div class="info-group">
              <label>Estado</label>
              <div class="readonly-field">{{ user.address.state || 'No seleccionado' }}</div>
            </div>
            <div class="info-group">
              <label>Código postal</label>
              <div class="readonly-field">{{ user.address.postalCode || 'No seleccionado' }}</div>
            </div>
            <div class="info-group">
              <label>País</label>
              <div class="readonly-field">{{ user.address.country || 'No seleccionado' }}</div>
            </div>
            <button type="button" class="close-btn" @click="showModal = false">Cerrar</button>
          </div>
        </div>
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
  padding: 2rem 1rem;
  background: var(--color-background);
  border-radius: 8px;
  display: block;
}

.step4-flex {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.map-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.map {
  width: 100%;
  height: 50vh;
  min-height: 250px;
  max-height: 60vh;
  border-radius: 8px;
  border: 2px solid var(--color-background);
  margin-bottom: 0.5rem;
}

.map-instructions {
  background: var(--color-background);
  padding: 1rem;
  border-radius: 8px;
}

.address-info {
  background: var(--color-background);
  padding: 1.2rem;
  border-radius: 8px;
}

.address-info h3 {
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
  color: var(--font-subtitle-color);
  margin-bottom: 1rem;
}

.address-display {
  display: grid;
  gap: 0.75rem;
}

.address-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border-left: 4px solid var(--color-secondary);
}

.address-field strong {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  color: var(--font-paragraph-color);
  min-width: 120px;
}

.address-field span {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--font-body-color);
  text-align: right;
  flex: 1;
}

.manual-fields {
  background: white;
  padding: 1.2rem;
  border-radius: 8px;
  border: 2px solid var(--color-background);
}

.manual-fields h3 {
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
  color: var(--font-subtitle-color);
  margin-bottom: 1rem;
}

.coordinates-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  color: var(--font-paragraph-color);
  margin-bottom: 0.5rem;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid var(--color-background);
  border-radius: 8px;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--font-body-color);
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-secondary);
}

.form-group input::placeholder {
  color: var(--color-text);
  opacity: 0.7;
}

.error {
  color: var(--color-accent);
  font-size: 0.9em;
  margin-top: 0.25rem;
  font-family: var(--font-paragraph-family);
}

/* Estilos para el control de búsqueda de Leaflet */
:deep(.leaflet-control) {
  z-index: 1000;
}

:deep(.leaflet-control input) {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
}

:deep(.leaflet-control button) {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
}

:deep(.leaflet-control button:hover) {
  background-color: var(--color-secondary) !important;
}

@media (max-width: 768px) {
  .map {
    height: 35vh;
    min-height: 180px;
  }
  .coordinates-group {
    grid-template-columns: 1fr;
  }
  .address-field {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  .address-field strong {
    min-width: auto;
  }
  .address-field span {
    text-align: left;
  }
}

.solo-mapa {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 50vh;
  gap: 2rem;
}

.map {
  width: 100%;
  height: 50vh;
  min-height: 300px;
  border-radius: 8px;
  border: 2px solid var(--color-background);
  max-width: 700px;
}

.info-btn {
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: var(--font-title-family);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.info-btn:hover {
  background: var(--color-secondary);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44, 62, 80, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-content h2 {
  font-family: var(--font-title-family);
  font-size: 1.3rem;
  font-weight: var(--font-title-weight);
  margin-bottom: 1rem;
}
.info-group {
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
}
.info-group label {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  color: var(--font-paragraph-color);
  margin-bottom: 0.2rem;
}
.readonly-field {
  padding: 0.75rem;
  border: 2px solid var(--color-background);
  border-radius: 8px;
  background: #f5f5f5;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--font-body-color);
  word-break: break-all;
}
.close-btn {
  margin-top: 1.5rem;
  padding: 0.7rem 1.5rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: var(--font-title-family);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  transition: background 0.2s;
}
.close-btn:hover {
  background: var(--color-secondary);
}
</style> 