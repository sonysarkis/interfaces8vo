<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';

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
          <button type="button" id="search-btn" style="margin-left: 5px; padding: 5px 10px; background: var(--color-primary); color: white; border: none; border-radius: 3px; cursor: pointer;">
            Buscar
          </button>
        </div>
      `;
      
      const searchInput = container.querySelector('#search-input') as HTMLInputElement;
      const searchBtn = container.querySelector('#search-btn') as HTMLButtonElement;
      
      // Evento de búsqueda
      const performSearch = async (e: Event) => {
        e.preventDefault(); // Prevenir el submit del formulario
        e.stopPropagation(); // Detener la propagación del evento
        const query = searchInput.value.trim();
        if (query) {
          await searchLocation(query);
        }
      };
      
      searchBtn.addEventListener('click', performSearch);
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevenir el submit del formulario
          performSearch(e);
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

function mapUserToBackend(user) {
  return {
    // Datos personales
    email: user.email,
    nombre: user.firstName,
    apellido: user.lastName,
    segundo_apellido: user.maidenName,
    edad: user.age,
    genero: user.gender,
    telefono: user.phone,
    username: user.username,
    fecha_nacimiento: user.birthDate,
    imagen: user.image,
    grupo_sanguineo: user.bloodGroup,
    altura: user.height,
    peso: user.weight,
    color_ojos: user.eyeColor,
    pelo_color: user.hair?.color,
    pelo_tipo: user.hair?.type,
    ip: user.ip,
    direccion: user.address?.address,
    ciudad: user.address?.city,
    estado: user.address?.state,
    estado_code: user.address?.stateCode,
    pais: user.address?.country,
    codigo_postal: user.address?.postalCode,
    coord_lat: user.address?.coordinates?.lat,
    coord_lng: user.address?.coordinates?.lng,
    mac: user.macAddress,
    universidad: user.university,
    banco_tipo_tarjeta: user.bank?.cardType,
    banco_numero_tarjeta: user.bank?.cardNumber,
    banco_expiracion: user.bank?.cardExpire,
    banco_iban: user.bank?.iban,
    banco_moneda: user.bank?.currency,
    compania_nombre: user.company?.name,
    compania_departamento: user.company?.department,
    compania_titulo: user.company?.title,
    compania_direccion: user.company?.address?.address,
    compania_ciudad: user.company?.address?.city,
    compania_estado: user.company?.address?.state,
    compania_estado_code: user.company?.address?.stateCode,
    compania_pais: user.company?.address?.country,
    compania_codigo_postal: user.company?.address?.postalCode,
    compania_coord_lat: user.company?.address?.coordinates?.lat,
    compania_coord_lng: user.company?.address?.coordinates?.lng,
    ein: user.ein,
    ssn: user.ssn,
    user_agent: user.userAgent,
    cripto_moneda: user.crypto?.coin,
    cripto_wallet: user.crypto?.wallet,
    cripto_network: user.crypto?.network,
    // status y type no se actualizan aquí, solo por admin
  };
}

async function saveProfile() {
  if (!isStepValid.value) return;
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  if (!id || !token) return;
  try {
    const payload = mapUserToBackend(user.value);
    const res = await fetch(`/admin-auth/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      await Swal.fire({
        icon: 'success',
        title: 'Perfil guardado',
        text: 'Tus datos han sido actualizados correctamente.'
      });
      window.location.reload();
    } else {
      const data = await res.json();
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: data.error || 'Error desconocido'
      });
    }
  } catch (e) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error de red o servidor'
    });
  }
}

// Obtener datos del usuario al montar el componente
onMounted(async () => {
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  if (id && token) {
    try {
      const res = await fetch(`/admin-auth/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        // Normalizar objetos anidados para evitar errores de acceso
        user.value = {
          ...data,
          hair: {
            color: data.hair?.color || '',
            type: data.hair?.type || ''
          },
          address: {
            ...(data.address || {}),
            coordinates: {
              lat: data.address?.coordinates?.lat ?? 0,
              lng: data.address?.coordinates?.lng ?? 0
            }
          },
          bank: {
            cardExpire: data.bank?.cardExpire || '',
            cardNumber: data.bank?.cardNumber || '',
            cardType: data.bank?.cardType || '',
            currency: data.bank?.currency || '',
            iban: data.bank?.iban || ''
          },
          company: {
            ...(data.company || {}),
            address: {
              ...(data.company?.address || {}),
              coordinates: {
                lat: data.company?.address?.coordinates?.lat ?? 0,
                lng: data.company?.address?.coordinates?.lng ?? 0
              }
            }
          },
          crypto: {
            coin: data.crypto?.coin || '',
            wallet: data.crypto?.wallet || '',
            network: data.crypto?.network || ''
          }
        };
      }
    } catch (e) {
      console.error('Error al obtener datos del usuario', e);
    }
  }
});
</script>

<template>
  <div class="container">
    <h1 class="page-title">Mi Perfil</h1>
    <form @submit.prevent="saveProfile" class="profile-form">
      <!-- Paso 1: Datos personales 1/3 -->
      <div v-if="step === 1" class="form-step">
        <h2 class="step-title">Datos personales (1/3)</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nombre</label>
            <input v-model="user.firstName" class="form-input" />
            <span class="error-message" v-if="errors.firstName">{{ errors.firstName }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Apellido</label>
            <input v-model="user.lastName" class="form-input" />
            <span class="error-message" v-if="errors.lastName">{{ errors.lastName }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Segundo Nombre</label>
            <input v-model="user.maidenName" class="form-input" />
            <span class="error-message" v-if="errors.maidenName">{{ errors.maidenName }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Edad</label>
            <input v-model="user.age" type="number" class="form-input" />
            <span class="error-message" v-if="errors.age">{{ errors.age }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Género</label>
            <div class="radio-group">
              <label v-for="opt in genderOptions" :key="opt.value" class="radio-option">
                <input type="radio" v-model="user.gender" :value="opt.value" class="radio-input" />
                <span class="radio-label">{{ opt.label }}</span>
              </label>
            </div>
            <span class="error-message" v-if="errors.gender">{{ errors.gender }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Correo electrónico</label>
            <input v-model="user.email" class="form-input" />
            <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
          </div>
        </div>
      </div>

      <!-- Paso 2: Datos personales 2/3 -->
      <div v-if="step === 2" class="form-step">
        <h2 class="step-title">Datos personales (2/3)</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Teléfono</label>
            <input v-model="user.phone" class="form-input" />
            <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Nombre de usuario</label>
            <input v-model="user.username" class="form-input" />
            <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input v-model="user.password" type="text" class="form-input" />
            <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de nacimiento</label>
            <input v-model="user.birthDate" type="date" class="form-input" />
            <span class="error-message" v-if="errors.birthDate">{{ errors.birthDate }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Grupo sanguíneo</label>
            <select v-model="user.bloodGroup" class="form-select">
              <option v-for="g in bloodGroups" :key="g" :value="g">{{ g }}</option>
            </select>
            <span class="error-message" v-if="errors.bloodGroup">{{ errors.bloodGroup }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Altura</label>
            <input v-model="user.height" type="number" step="0.01" class="form-input" />
            <span class="error-message" v-if="errors.height">{{ errors.height }}</span>
          </div>
        </div>
      </div>

      <!-- Paso 3: Datos personales 3/3 -->
      <div v-if="step === 3" class="form-step">
        <h2 class="step-title">Datos personales (3/3)</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Peso (KG)</label>
            <input v-model="user.weight" type="number" step="0.01" class="form-input" />
            <span class="error-message" v-if="errors.weight">{{ errors.weight }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Color de ojos</label>
            <input v-model="user.eyeColor" class="form-input" />
            <span class="error-message" v-if="errors.eyeColor">{{ errors.eyeColor }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Pelo (color)</label>
            <input v-model="user.hair.color" class="form-input" />
            <span class="error-message" v-if="errors['hair.color']">{{ errors['hair.color'] }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Pelo (tipo)</label>
            <input v-model="user.hair.type" class="form-input" />
            <span class="error-message" v-if="errors['hair.type']">{{ errors['hair.type'] }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Dirección</label>
            <input v-model="user.address.address" class="form-input" />
            <span class="error-message" v-if="errors['address.address']">{{ errors['address.address'] }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Ciudad</label>
            <input v-model="user.address.city" class="form-input" />
            <span class="error-message" v-if="errors['address.city']">{{ errors['address.city'] }}</span>
          </div>
        </div>
      </div>

      <!-- Paso 4: Ubicación y dirección con mapa -->
      <div v-if="step === 4" class="map-step">
        <h2 class="step-title">Ubicación</h2>
        <div class="map-container">
          <div id="map" class="map"></div>
          <div class="map-actions">
            <button type="button" class="info-btn" @click="showModal = true">
              Ver información de ubicación
            </button>
          </div>
        </div>
        
        <!-- Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content">
            <h2 class="modal-title">Información de ubicación</h2>
            <div class="modal-grid">
              <div class="info-group">
                <label class="info-label">Latitud</label>
                <div class="readonly-field">{{ user.address.coordinates.lat || 'No seleccionada' }}</div>
              </div>
              <div class="info-group">
                <label class="info-label">Longitud</label>
                <div class="readonly-field">{{ user.address.coordinates.lng || 'No seleccionada' }}</div>
              </div>
              <div class="info-group">
                <label class="info-label">Dirección MAC</label>
                <input v-model="user.macAddress" placeholder="Ej: 47:fa:41:18:ec:eb" class="form-input" />
              </div>
              <div class="info-group">
                <label class="info-label">Dirección</label>
                <input v-model="user.address.address" class="form-input" placeholder="Dirección manual o seleccionada" />
              </div>
              <div class="info-group">
                <label class="info-label">Ciudad</label>
                <div class="readonly-field">{{ user.address.city || 'No seleccionada' }}</div>
              </div>
              <div class="info-group">
                <label class="info-label">Estado</label>
                <div class="readonly-field">{{ user.address.state || 'No seleccionado' }}</div>
              </div>
              <div class="info-group">
                <label class="info-label">Código postal</label>
                <input v-model="user.address.postalCode" class="form-input" placeholder="Código postal manual o seleccionado" />
              </div>
              <div class="info-group">
                <label class="info-label">País</label>
                <div class="readonly-field">{{ user.address.country || 'No seleccionado' }}</div>
              </div>
            </div>
            <button type="button" class="close-btn" @click="showModal = false">Cerrar</button>
          </div>
        </div>
      </div>

      <!-- Paso 5: Profesional y bancaria 1/3 -->
      <div v-if="step === 5" class="form-step">
        <h2 class="step-title">Profesional y bancaria (1/3)</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Universidad</label>
            <input v-model="user.university" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de banco</label>
            <input v-model="user.bank.cardType" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Número de banco</label>
            <input v-model="user.bank.cardNumber" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Expiración del banco</label>
            <input v-model="user.bank.cardExpire" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Banco (IBAN)</label>
            <input v-model="user.bank.iban" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Moneda del banco</label>
            <input v-model="user.bank.currency" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Paso 6: Profesional y bancaria 2/3 -->
      <div v-if="step === 6" class="form-step">
        <h2 class="step-title">Profesional y bancaria (2/3)</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Compañía</label>
            <input v-model="user.company.name" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Departamento</label>
            <input v-model="user.company.department" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Título</label>
            <input v-model="user.company.title" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Dirección Compañía</label>
            <input v-model="user.company.address.address" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Ciudad Compañía</label>
            <input v-model="user.company.address.city" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Estado Compañía</label>
            <input v-model="user.company.address.state" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Paso 7: Profesional y bancaria 3/3 -->
      <div v-if="step === 7" class="form-step">
        <h2 class="step-title">Profesional y bancaria (3/3)</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Código Postal Compañía</label>
            <input v-model="user.company.address.postalCode" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">País Compañía</label>
            <input v-model="user.company.address.country" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Latitud Compañía</label>
            <input v-model="user.company.address.coordinates.lat" type="number" step="0.00001" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Longitud Compañía</label>
            <input v-model="user.company.address.coordinates.lng" type="number" step="0.00001" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">EIN</label>
            <input v-model="user.ein" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">SSN</label>
            <input v-model="user.ssn" class="form-input" />
          </div>
        </div>
      </div>

      <!-- Paso 8: Seguridad y otros datos 1/2 -->
      <div v-if="step === 8" class="form-step">
        <h2 class="step-title">Seguridad y otros datos (1/2)</h2>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">User Agent</label>
            <input v-model="user.userAgent" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Cripto (moneda)</label>
            <input v-model="user.crypto.coin" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Cripto (wallet)</label>
            <input v-model="user.crypto.wallet" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Cripto (network)</label>
            <input v-model="user.crypto.network" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Rol</label>
            <input :value="user.type" class="form-input" readonly />
          </div>
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                :checked="user.status === 'inactive'"
                disabled
                readonly
                class="checkbox-input"
              />
              <span class="checkbox-text">Deshabilitado</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Paso 9: Confirmación -->
      <div v-if="step === 9" class="confirmation-step">
        <h2 class="step-title">Confirmar y guardar</h2>
        <p class="confirmation-text">Revisa tus datos y haz clic en Guardar para finalizar.</p>
      </div>

      <div class="wizard-nav">
        <button type="button" @click="prevStep" :disabled="step === 1" class="nav-btn nav-btn-secondary">
          Anterior
        </button>
        <button type="button" @click="nextStep" :disabled="step === totalSteps || !isStepValid" class="nav-btn nav-btn-primary">
          Siguiente
        </button>
        <button v-if="step === totalSteps" type="submit" :disabled="!isStepValid" class="nav-btn nav-btn-success">
          Guardar
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.page-title {
  font-family: var(--font-title-family);
  font-size: var(--font-title-size);
  font-weight: var(--font-title-weight);
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.profile-form {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.form-step, .map-step, .confirmation-step {
  margin-bottom: 2rem;
}

.step-title {
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-secondary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.form-input, .form-select {
  padding: 0.75rem;
  border: 2px solid var(--color-background);
  border-radius: 8px;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  background: white;
  transition: all 0.3s ease;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-input::placeholder {
  color: var(--color-text);
  opacity: 0.7;
}

.error-message {
  color: var(--color-accent);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-family: var(--font-paragraph-family);
}

.radio-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.radio-input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-secondary);
}

.radio-label {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-secondary);
}

.checkbox-text {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
}

.map-step {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 300px);
  min-height: 500px;
}

.map-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
}

.map {
  flex: 1;
  min-height: 400px;
  border-radius: 8px;
  border: 2px solid var(--color-background);
  max-width: 100%;
}

.map-actions {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.info-btn {
  padding: 0.8rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.info-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-1px);
}

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
  background: white;
  border-radius: 12px;
  padding: 2rem;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.15);
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-family: var(--font-subtitle-family);
  font-size: 1.3rem;
  font-weight: var(--font-subtitle-weight);
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.modal-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.readonly-field {
  padding: 0.75rem;
  border: 2px solid var(--color-background);
  border-radius: 8px;
  background: #f5f5f5;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  word-break: break-all;
}

.close-btn {
  padding: 0.7rem 1.5rem;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

.confirmation-step {
  text-align: center;
  padding: 2rem;
}

.confirmation-text {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  margin: 0;
}

.wizard-nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-background);
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn-primary {
  background: var(--color-primary);
  color: white;
}

.nav-btn-primary:hover:not(:disabled) {
  background: var(--color-secondary);
  transform: translateY(-1px);
}

.nav-btn-secondary {
  background: var(--color-secondary);
  color: white;
}

.nav-btn-secondary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.nav-btn-success {
  background: #10b981;
  color: white;
}

.nav-btn-success:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .wizard-nav {
    flex-direction: column;
  }
  
  .map-step {
    height: calc(100vh - 200px);
    min-height: 400px;
  }
  
  .map {
    min-height: 300px;
  }
}
</style>