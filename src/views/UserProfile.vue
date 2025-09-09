<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Swal from 'sweetalert2';

const user = ref<any>({
  id: 1,
  firstName: "Emily",
  lastName: "Johnson",
  maidenName: "Smith",
  age: 28,
  gender: "female",
  email: "emily.johnson@x.dummyjson.com",
  phone: "+81 965-431-3024",
  username: "emilys",
  password: "", // por defecto vacío
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

const errors = ref<any>({});
const imageError = ref(false);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>('');

// Watcher para resetear el error de imagen cuando cambie la URL
watch(() => user.value.image, () => {
  imageError.value = false;
});

// Variables para el mapa personal
let map: L.Map | null = null;
let marker: L.Marker | null = null;
let searchControl: any = null;

// Variables para el mapa de la compañía
let companyMap: L.Map | null = null;
let companyMarker: L.Marker | null = null;
let companySearchControl: any = null;

const showModal = ref(false);
const showCompanyModal = ref(false);

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

// Función para inicializar el mapa de la compañía
async function initCompanyMap() {
  if (companyMap) return;
  
  await nextTick();
  
  // Capas base para el mapa de la compañía
  const companyCalleLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  });

  const companySateliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles © Esri'
    }
  );

  // Inicializa el mapa de la compañía
  companyMap = L.map('company-map', {
    center: [user.value.company.address.coordinates.lat || 0, user.value.company.address.coordinates.lng || 0],
    zoom: 13,
    layers: [companyCalleLayer]
  });

  // Control de capas para el mapa de la compañía
  L.control.layers(
    {
      'Calles': companyCalleLayer,
      'Satélite': companySateliteLayer
    }
  ).addTo(companyMap);
  
  // Crear marcador inicial para la compañía
  if (user.value.company.address.coordinates.lat && user.value.company.address.coordinates.lng) {
    companyMarker = L.marker([user.value.company.address.coordinates.lat, user.value.company.address.coordinates.lng]).addTo(companyMap);
  }
  
  // Evento de clic en el mapa de la compañía
  companyMap.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    
    // Actualizar coordenadas de la compañía
    user.value.company.address.coordinates.lat = lat;
    user.value.company.address.coordinates.lng = lng;
    
    // Actualizar marcador de la compañía
    if (companyMarker) {
      companyMarker.setLatLng([lat, lng]);
    } else {
      companyMarker = L.marker([lat, lng]).addTo(companyMap!);
    }
    
    // Obtener dirección completa desde coordenadas para la compañía
    await getCompanyAddressFromCoordinates(lat, lng);
  });
  
  // Agregar control de búsqueda para la compañía
  addCompanySearchControl();
}

// Función para buscar ubicación
async function searchLocation(query: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(
      `/admin-auth/nominatim?url=${encodeURIComponent(url)}`
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

// Función para agregar control de búsqueda para la compañía
function addCompanySearchControl() {
  if (!companyMap) return;
  
  // Crear control de búsqueda personalizado para la compañía
  const companySearchControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
    
    onAdd: function() {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      container.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
          <input type="text" id="company-search-input" placeholder="Buscar ubicación de compañía..." 
                 style="width: 200px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
          <button type="button" id="company-search-btn" style="margin-left: 5px; padding: 5px 10px; background: var(--color-primary); color: white; border: none; border-radius: 3px; cursor: pointer;">
            Buscar
          </button>
        </div>
      `;
      
      const searchInput = container.querySelector('#company-search-input') as HTMLInputElement;
      const searchBtn = container.querySelector('#company-search-btn') as HTMLButtonElement;
      
      // Evento de búsqueda para la compañía
      const performSearch = async (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        const query = searchInput.value.trim();
        if (query) {
          await searchCompanyLocation(query);
        }
      };
      
      searchBtn.addEventListener('click', performSearch);
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch(e);
        }
      });
      
      return container;
    }
  });
  
  companyMap.addControl(new companySearchControl());
}

// Función para buscar ubicación de la compañía
async function searchCompanyLocation(query: string) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const response = await fetch(
      `/admin-auth/nominatim?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    
    if (data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      
      // Actualizar coordenadas de la compañía
      user.value.company.address.coordinates.lat = lat;
      user.value.company.address.coordinates.lng = lng;
      
      // Actualizar marcador de la compañía
      if (companyMarker) {
        companyMarker.setLatLng([lat, lng]);
      } else {
        companyMarker = L.marker([lat, lng]).addTo(companyMap!);
      }
      
      // Centrar mapa de la compañía
      companyMap!.setView([lat, lng], 15);
      
      // Obtener dirección detallada de la compañía
      await getCompanyAddressFromCoordinates(lat, lng);
    }
  } catch (error) {
    console.error('Error buscando ubicación de compañía:', error);
  }
}

// Función para obtener dirección completa desde coordenadas
async function getAddressFromCoordinates(lat: number, lng: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const response = await fetch(
      `/admin-auth/nominatim?url=${encodeURIComponent(url)}`
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
      
      // Extraer state code de manera más robusta
      let stateCode = address.state_code || address['ISO3166-2-lvl4'] || '';
      
      // Si no hay state code directo, intentar generarlo
      if (!stateCode && (address.state || address.province)) {
        const stateName = address.state || address.province;
        const country = address.country_code?.toUpperCase() || '';
        
        // Para Estados Unidos, generar códigos de estado comunes
        if (country === 'US') {
          stateCode = generateUSStateCode(stateName);
        }
        // Para otros países, tomar las primeras 2 letras del estado en mayúsculas
        else if (stateName.length >= 2) {
          stateCode = stateName.substring(0, 2).toUpperCase();
        }
      }
      
      user.value.address.stateCode = stateCode;
      user.value.address.postalCode = address.postcode || '';
      user.value.address.country = address.country || '';
      
      console.log('Dirección extraída del mapa:', {
        address: user.value.address.address,
        city: user.value.address.city,
        state: user.value.address.state,
        stateCode: user.value.address.stateCode,
        country: user.value.address.country,
        postalCode: user.value.address.postalCode
      });
    }
  } catch (error) {
    console.error('Error obteniendo dirección:', error);
  }
}

// Función para obtener dirección completa de la compañía desde coordenadas
async function getCompanyAddressFromCoordinates(lat: number, lng: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const response = await fetch(
      `/admin-auth/nominatim?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    
    if (data.address) {
      const address = data.address;
      
      // Extraer y asignar todos los campos de dirección de la compañía automáticamente
      user.value.company.address.address = [
        address.house_number,
        address.road,
        address.suburb
      ].filter(Boolean).join(' ');
      
      user.value.company.address.city = address.city || address.town || address.village || address.county || '';
      user.value.company.address.state = address.state || address.province || '';
      
      // Extraer state code de manera más robusta para la compañía
      let stateCode = address.state_code || address['ISO3166-2-lvl4'] || '';
      
      // Si no hay state code directo, intentar generarlo
      if (!stateCode && (address.state || address.province)) {
        const stateName = address.state || address.province;
        const country = address.country_code?.toUpperCase() || '';
        
        // Para Estados Unidos, generar códigos de estado comunes
        if (country === 'US') {
          stateCode = generateUSStateCode(stateName);
        }
        // Para otros países, tomar las primeras 2 letras del estado en mayúsculas
        else if (stateName.length >= 2) {
          stateCode = stateName.substring(0, 2).toUpperCase();
        }
      }
      
      user.value.company.address.stateCode = stateCode;
      user.value.company.address.postalCode = address.postcode || '';
      user.value.company.address.country = address.country || '';
      
      console.log('Dirección de compañía extraída del mapa:', {
        address: user.value.company.address.address,
        city: user.value.company.address.city,
        state: user.value.company.address.state,
        stateCode: user.value.company.address.stateCode,
        country: user.value.company.address.country,
        postalCode: user.value.company.address.postalCode
      });
    }
  } catch (error) {
    console.error('Error obteniendo dirección de compañía:', error);
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

// Función para generar códigos de estado de EE.UU.
function generateUSStateCode(stateName: string): string {
  const stateMap: { [key: string]: string } = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
    'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
    'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
    'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
    'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
    'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
    'district of columbia': 'DC', 'puerto rico': 'PR'
  };
  
  const normalizedName = stateName.toLowerCase().trim();
  return stateMap[normalizedName] || stateName.substring(0, 2).toUpperCase();
}

// Función para manejar la selección de archivo
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB');
      return;
    }
    
    selectedFile.value = file;
    
    // Crear URL de vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
      user.value.image = previewUrl.value; // Actualizar la imagen del usuario temporalmente
    };
    reader.readAsDataURL(file);
  }
}

// Función para limpiar la selección de archivo
function clearFileSelection() {
  selectedFile.value = null;
  previewUrl.value = '';
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

// Función para subir archivo (simulada - puedes implementar la subida real)
async function uploadFile(): Promise<string | null> {
  if (!selectedFile.value) return null;
  
  try {
    // Aquí iría la lógica real de subida al servidor
    // Por ahora simularemos que se sube y retornamos la URL de vista previa
    
    // Ejemplo de cómo sería con FormData para una API real:
    /*
    const formData = new FormData();
    formData.append('image', selectedFile.value);
    
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    }
    */
    
    // Simulación: retornamos la URL de vista previa
    return previewUrl.value;
    
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    alert('Error al subir el archivo');
    return null;
  }
}

// Observar cambios en el paso para inicializar el mapa
const currentStep = computed(() => step.value);

function validateField(field: any) {
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
      // Solo validar si el usuario intenta cambiar la contraseña
      if (user.value.password && user.value.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
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
    ['firstName', 'lastName', 'maidenName', 'age', 'gender', 'email', 'image'],
    // Paso 2
    ['phone', 'username', 'password', 'birthDate', 'bloodGroup', 'height'],
    // Paso 3
    ['weight', 'eyeColor', 'hair.color', 'hair.type'],
    // Paso 4
    ['address.state', 'address.stateCode', 'address.postalCode', 'address.country', 'address.coordinates.lat', 'address.coordinates.lng', 'ip', 'macAddress'],
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
    // Inicializar mapa de la compañía cuando llegamos al paso 6
    if (step.value === 6) {
      nextTick(() => {
        initCompanyMap();
      });
    }
  }
}
function prevStep() {
  if (step.value > 1) step.value--;
}

function mapUserToBackend(user: any) {
  let fecha_nacimiento = user.birthDate;
  if (fecha_nacimiento && fecha_nacimiento.length > 10) {
    // Si viene en formato ISO, recorta a YYYY-MM-DD
    fecha_nacimiento = fecha_nacimiento.slice(0, 10);
  }
  
  // Función helper para validar y limpiar valores
  const cleanValue = (value: any, isImage = false) => {
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'string' && value.trim() === '') return undefined;
    
    // Manejo especial para imágenes
    if (isImage && typeof value === 'string') {
      // Si es una URL muy larga (posiblemente base64), mantenerla completa
      // ya que cambiaremos la columna a TEXT
      if (value.startsWith('data:image/') || value.length > 500) {
        // Para base64 o URLs muy largas, truncar a un tamaño razonable
        // pero manteniendo el formato válido
        if (value.startsWith('data:image/')) {
          return value; // Mantener base64 completo después de la migración
        }
      }
      return value;
    }
    
    if (typeof value === 'string' && value.length > 1000) {
      // Truncar strings muy largos (excepto imágenes)
      return value.slice(0, 1000);
    }
    return value;
  };
  
  const payload: any = {};
  
  // Solo agregar campos con valores válidos
  if (cleanValue(user.email)) payload.email = cleanValue(user.email);
  if (cleanValue(user.type)) payload.type = cleanValue(user.type);
  if (cleanValue(user.status)) payload.status = cleanValue(user.status);
  if (cleanValue(user.firstName)) payload.nombre = cleanValue(user.firstName);
  if (cleanValue(user.lastName)) payload.apellido = cleanValue(user.lastName);
  if (cleanValue(user.maidenName)) payload.segundo_apellido = cleanValue(user.maidenName);
  if (cleanValue(user.age)) payload.edad = cleanValue(user.age);
  if (cleanValue(user.gender)) payload.genero = cleanValue(user.gender);
  if (cleanValue(user.phone)) payload.telefono = cleanValue(user.phone);
  if (cleanValue(user.username)) payload.username = cleanValue(user.username);
  if (cleanValue(fecha_nacimiento)) payload.fecha_nacimiento = cleanValue(fecha_nacimiento);
  if (cleanValue(user.image, true)) payload.imagen = cleanValue(user.image, true);
  if (cleanValue(user.bloodGroup)) payload.grupo_sanguineo = cleanValue(user.bloodGroup);
  if (cleanValue(user.height)) payload.altura = cleanValue(user.height);
  if (cleanValue(user.peso)) payload.peso = cleanValue(user.weight);
  if (cleanValue(user.eyeColor)) payload.color_ojos = cleanValue(user.eyeColor);
  if (cleanValue(user.hair?.color)) payload.pelo_color = cleanValue(user.hair.color);
  if (cleanValue(user.hair?.type)) payload.pelo_tipo = cleanValue(user.hair.type);
  if (cleanValue(user.ip)) payload.ip = cleanValue(user.ip);
  if (cleanValue(user.address?.address)) payload.direccion = cleanValue(user.address.address);
  if (cleanValue(user.address?.city)) payload.ciudad = cleanValue(user.address.city);
  if (cleanValue(user.address?.state)) payload.estado = cleanValue(user.address.state);
  if (cleanValue(user.address?.stateCode)) payload.estado_code = cleanValue(user.address.stateCode);
  if (cleanValue(user.address?.country)) payload.pais = cleanValue(user.address.country);
  if (cleanValue(user.address?.postalCode)) payload.codigo_postal = cleanValue(user.address.postalCode);
  if (cleanValue(user.address?.coordinates?.lat)) payload.coord_lat = cleanValue(user.address.coordinates.lat);
  if (cleanValue(user.address?.coordinates?.lng)) payload.coord_lng = cleanValue(user.address.coordinates.lng);
  if (cleanValue(user.macAddress)) payload.mac = cleanValue(user.macAddress);
  if (cleanValue(user.university)) payload.universidad = cleanValue(user.university);
  if (cleanValue(user.bank?.cardType)) payload.banco_tipo_tarjeta = cleanValue(user.bank.cardType);
  if (cleanValue(user.bank?.cardNumber)) payload.banco_numero_tarjeta = cleanValue(user.bank.cardNumber);
  if (cleanValue(user.bank?.cardExpire)) payload.banco_expiracion = cleanValue(user.bank.cardExpire);
  if (cleanValue(user.bank?.iban)) payload.banco_iban = cleanValue(user.bank.iban);
  if (cleanValue(user.bank?.currency)) payload.banco_moneda = cleanValue(user.bank.currency);
  if (cleanValue(user.company?.name)) payload.compania_nombre = cleanValue(user.company.name);
  if (cleanValue(user.company?.department)) payload.compania_departamento = cleanValue(user.company.department);
  if (cleanValue(user.company?.title)) payload.compania_titulo = cleanValue(user.company.title);
  if (cleanValue(user.company?.address?.address)) payload.compania_direccion = cleanValue(user.company.address.address);
  if (cleanValue(user.company?.address?.city)) payload.compania_ciudad = cleanValue(user.company.address.city);
  if (cleanValue(user.company?.address?.state)) payload.compania_estado = cleanValue(user.company.address.state);
  if (cleanValue(user.company?.address?.stateCode)) payload.compania_estado_code = cleanValue(user.company.address.stateCode);
  if (cleanValue(user.company?.address?.country)) payload.compania_pais = cleanValue(user.company.address.country);
  if (cleanValue(user.company?.address?.postalCode)) payload.compania_codigo_postal = cleanValue(user.company.address.postalCode);
  if (cleanValue(user.company?.address?.coordinates?.lat)) payload.compania_coord_lat = cleanValue(user.company.address.coordinates.lat);
  if (cleanValue(user.company?.address?.coordinates?.lng)) payload.compania_coord_lng = cleanValue(user.company.address.coordinates.lng);
  if (cleanValue(user.ein)) payload.ein = cleanValue(user.ein);
  if (cleanValue(user.ssn)) payload.ssn = cleanValue(user.ssn);
  if (cleanValue(user.userAgent)) payload.user_agent = cleanValue(user.userAgent);
  if (cleanValue(user.crypto?.coin)) payload.cripto_moneda = cleanValue(user.crypto.coin);
  if (cleanValue(user.crypto?.wallet)) payload.cripto_wallet = cleanValue(user.crypto.wallet);
  if (cleanValue(user.crypto?.network)) payload.cripto_network = cleanValue(user.crypto.network);
  if (cleanValue(user.password)) payload.password = cleanValue(user.password);
  
  return payload;
}

async function saveProfile() {
  console.log('🚀 Iniciando saveProfile()');
  
  if (!isStepValid.value) {
    console.log('❌ Step no válido:', step.value);
    await Swal.fire({
      icon: 'warning',
      title: 'Datos incompletos',
      text: 'Por favor, completa todos los campos requeridos antes de guardar.'
    });
    return;
  }
  
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  
  console.log('📋 Datos de autenticación:');
  console.log('  - ID:', id);
  console.log('  - Token presente:', !!token);
  
  if (!id || !token) {
    console.log('❌ Faltan datos de autenticación');
    await Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: 'No se encontraron los datos de autenticación. Por favor, inicia sesión nuevamente.'
    });
    return;
  }
  
  try {
    // Si hay un archivo seleccionado, subirlo primero
    if (selectedFile.value) {
      console.log('📁 Subiendo archivo:', selectedFile.value.name);
      const uploadedUrl = await uploadFile();
      if (uploadedUrl) {
        user.value.image = uploadedUrl;
        console.log('✅ Archivo subido exitosamente:', uploadedUrl);
      } else {
        console.log('❌ Error al subir archivo');
      }
    }
    
    const payload = mapUserToBackend(user.value);
    console.log('📤 Payload a enviar:', payload);
    
    const url = `/admin-auth/user/${id}`;
    console.log('🌐 URL de petición:', url);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📨 Respuesta del servidor:');
    console.log('  - Status:', res.status);
    console.log('  - Status Text:', res.statusText);
    console.log('  - OK:', res.ok);
    
    const responseData = await res.json();
    console.log('📄 Datos de respuesta:', responseData);
    
    if (res.ok) {
      console.log('✅ Perfil guardado exitosamente');
      await Swal.fire({
        icon: 'success',
        title: 'Perfil guardado',
        text: 'Tus datos han sido actualizados correctamente.'
      });
      
      // Redirigir al inicio (paso 1) después de guardar
      step.value = 1;
      
      // Opcional: también recargar los datos del usuario
      // window.location.reload();
    } else {
      console.log('❌ Error del servidor:', responseData);
      await Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: responseData.error || 'Error desconocido'
      });
    }
  } catch (e) {
    console.log('💥 Error de excepción:', e);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error de red o servidor'
    });
  }
}

// Función para transformar los datos del backend al formato esperado por el frontend
function backendToUser(data: any) {
  return {
    id: data.id,
    firstName: data.nombre || '',
    lastName: data.apellido || '',
    maidenName: data.segundo_apellido || '',
    age: data.edad || '',
    gender: data.genero || '',
    email: data.email || '',
    phone: data.telefono || '',
    username: data.username || '',
    password: '', // nunca mostrar la contraseña real
    birthDate: data.fecha_nacimiento || '',
    image: data.imagen || '',
    bloodGroup: data.grupo_sanguineo || '',
    height: data.altura || '',
    weight: data.peso || '',
    eyeColor: data.color_ojos || '',
    hair: {
      color: data.pelo_color || '',
      type: data.pelo_tipo || ''
    },
    ip: data.ip || '',
    address: {
      address: data.direccion || '',
      city: data.ciudad || '',
      state: data.estado || '',
      stateCode: data.estado_code || '',
      postalCode: data.codigo_postal || '',
      coordinates: {
        lat: data.coord_lat ?? 0,
        lng: data.coord_lng ?? 0
      },
      country: data.pais || ''
    },
    macAddress: data.mac || '',
    university: data.universidad || '',
    bank: {
      cardExpire: data.banco_expiracion || '',
      cardNumber: data.banco_numero_tarjeta || '',
      cardType: data.banco_tipo_tarjeta || '',
      currency: data.banco_moneda || '',
      iban: data.banco_iban || ''
    },
    company: {
      department: data.compania_departamento || '',
      name: data.compania_nombre || '',
      title: data.compania_titulo || '',
      address: {
        address: data.compania_direccion || '',
        city: data.compania_ciudad || '',
        state: data.compania_estado || '',
        stateCode: data.compania_estado_code || '',
        postalCode: data.compania_codigo_postal || '',
        coordinates: {
          lat: data.compania_coord_lat ?? 0,
          lng: data.compania_coord_lng ?? 0
        },
        country: data.compania_pais || ''
      }
    },
    ein: data.ein || '',
    ssn: data.ssn || '',
    userAgent: data.user_agent || '',
    crypto: {
      coin: data.cripto_moneda || '',
      wallet: data.cripto_wallet || '',
      network: data.cripto_network || ''
    },
    type: data.type || '',
    status: data.status || '',
  };
}

// Obtener datos del usuario al montar el componente
onMounted(async () => {
  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');
  if (id && token) {
    try {
      const res = await fetch(`/admin-auth/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        user.value = backendToUser(data);
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
          <div class="form-group">
            <label class="form-label">Imagen de perfil</label>
            
            <!-- Opción 1: Subir archivo -->
            <div class="image-upload-section">
              <label class="upload-label">
                <input 
                  id="file-input"
                  type="file" 
                  accept="image/*" 
                  @change="handleFileSelect"
                  class="file-input"
                />
                <span class="upload-button">
                  📁 Seleccionar archivo
                </span>
              </label>
              
              <div v-if="selectedFile" class="file-info">
                <span class="file-name">{{ selectedFile.name }}</span>
                <button type="button" @click="clearFileSelection" class="clear-file-btn">✕</button>
              </div>
            </div>
            
            <!-- Opción 2: URL -->
            <div class="url-input-section">
              <label class="form-label-small">O ingresar URL:</label>
              <input v-model="user.image" class="form-input" placeholder="URL de la imagen de perfil" />
            </div>
            
            <span class="error-message" v-if="errors.image">{{ errors.image }}</span>
          </div>
        </div>
        
        <!-- Vista previa de la imagen -->
        <div v-if="user.image || previewUrl" class="image-preview">
          <label class="form-label">Vista previa:</label>
          <img 
            :src="previewUrl || user.image" 
            alt="Imagen de perfil" 
            class="preview-image" 
            @error="imageError = true" 
          />
          <p v-if="imageError" class="error-message">No se pudo cargar la imagen</p>
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
          <!-- Dirección y ciudad se extraen automáticamente del mapa en el paso 4 -->
        </div>
      </div>

      <!-- Paso 4: Ubicación y dirección con mapa -->
      <div v-if="step === 4" class="map-step">
        <h2 class="step-title">Ubicación</h2>
        <div class="map-container">
          <div id="map" class="map"></div>
          <div class="map-actions">
            <button 
              type="button" 
              class="info-btn" 
              @click="showModal = true"
              style="background: #e74c3c !important; color: white !important; font-size: 16px !important; font-weight: bold !important; padding: 1rem 2rem !important; border: 3px solid #c0392b !important;"
            >
              🗺️ Ver información de ubicación
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
                <label class="info-label">IP</label>
                <input v-model="user.ip" placeholder="Ej: 192.168.1.1" class="form-input" />
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
                <label class="info-label">Código de Estado</label>
                <input 
                  v-model="user.address.stateCode" 
                  placeholder="Se extrae automáticamente del mapa" 
                  class="form-input"
                  title="Este campo se completa automáticamente al seleccionar una ubicación en el mapa"
                />
                <small class="field-hint">💡 Se completa automáticamente al hacer clic en el mapa</small>
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

      <!-- Paso 6: Ubicación de la Compañía con mapa -->
      <div v-if="step === 6" class="map-step">
        <h2 class="step-title">Ubicación de la Compañía</h2>
        <div class="company-info-section">
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
          </div>
        </div>
        
        <div class="map-container">
          <div id="company-map" class="map"></div>
          <div class="map-actions">
            <button 
              type="button" 
              class="info-btn" 
              @click="showCompanyModal = true"
              style="background: #27ae60 !important; color: white !important; font-size: 16px !important; font-weight: bold !important; padding: 1rem 2rem !important; border: 3px solid #229954 !important;"
            >
              🏢 Ver información de ubicación de compañía
            </button>
          </div>
        </div>
        
        <!-- Modal de información de compañía -->
        <div v-if="showCompanyModal" class="modal-overlay" @click.self="showCompanyModal = false">
          <div class="modal-content">
            <h2 class="modal-title">📍 Información de ubicación de compañía</h2>
            
            <!-- Información básica de la compañía -->
            <div class="company-basic-info">
              <div class="info-group">
                <label class="info-label">🏢 Compañía</label>
                <div class="readonly-field">{{ user.company.name || 'No especificada' }}</div>
              </div>
              <div class="info-group">
                <label class="info-label">🏬 Departamento</label>
                <div class="readonly-field">{{ user.company.department || 'No especificado' }}</div>
              </div>
              <div class="info-group">
                <label class="info-label">💼 Título/Cargo</label>
                <div class="readonly-field">{{ user.company.title || 'No especificado' }}</div>
              </div>
            </div>
            
            <div class="modal-divider"></div>
            
            <!-- Coordenadas del mapa -->
            <div class="coordinates-section">
              <h3 class="section-subtitle">🗺️ Coordenadas del mapa</h3>
              <div class="coordinates-grid">
                <div class="info-group">
                  <label class="info-label">Latitud</label>
                  <div class="readonly-field coordinate-value">{{ user.company.address.coordinates.lat || 'No seleccionada' }}</div>
                </div>
                <div class="info-group">
                  <label class="info-label">Longitud</label>
                  <div class="readonly-field coordinate-value">{{ user.company.address.coordinates.lng || 'No seleccionada' }}</div>
                </div>
              </div>
            </div>
            
            <div class="modal-divider"></div>
            
            <!-- Información de dirección -->
            <div class="address-section">
              <h3 class="section-subtitle">🏠 Dirección completa</h3>
              <div class="modal-grid">
                <div class="info-group">
                  <label class="info-label">Dirección</label>
                  <input v-model="user.company.address.address" class="form-input" placeholder="Dirección manual o seleccionada" />
                </div>
                <div class="info-group">
                  <label class="info-label">Ciudad</label>
                  <div class="readonly-field">{{ user.company.address.city || 'No seleccionada' }}</div>
                </div>
                <div class="info-group">
                  <label class="info-label">Estado/Provincia</label>
                  <div class="readonly-field">{{ user.company.address.state || 'No seleccionado' }}</div>
                </div>
                <div class="info-group">
                  <label class="info-label">Código de Estado</label>
                  <input 
                    v-model="user.company.address.stateCode" 
                    placeholder="Se extrae automáticamente" 
                    class="form-input auto-field"
                    title="Este campo se completa automáticamente al seleccionar una ubicación en el mapa"
                  />
                  <small class="field-hint">💡 Se completa automáticamente al hacer clic en el mapa</small>
                </div>
                <div class="info-group">
                  <label class="info-label">Código postal</label>
                  <input v-model="user.company.address.postalCode" class="form-input" placeholder="Código postal manual o seleccionado" />
                </div>
                <div class="info-group">
                  <label class="info-label">País</label>
                  <div class="readonly-field">{{ user.company.address.country || 'No seleccionado' }}</div>
                </div>
              </div>
            </div>
            
            <!-- Instrucciones de uso -->
            <div class="usage-instructions">
              <p class="instruction-text">
                💡 <strong>Instrucciones:</strong> Haz clic en el mapa o usa la búsqueda para seleccionar la ubicación de tu compañía. 
                Los datos se extraerán automáticamente y puedes editarlos si es necesario.
              </p>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="close-btn" @click="showCompanyModal = false">Cerrar</button>
            </div>
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
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
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
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.form-step, .map-step, .confirmation-step {
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
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
  display: flex !important;
  flex-direction: column;
  height: auto;
  min-height: 500px;
  width: 100%;
  box-sizing: border-box;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.company-info-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid var(--color-background);
}

.map-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  border: 2px solid var(--color-background, #ecf0f1);
  border-radius: 8px;
  background: white;
}

.map {
  flex: 1;
  min-height: 400px;
  border-radius: 8px 8px 0 0;
  border: none;
  border-bottom: 1px solid #e0e0e0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

.map-actions {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.9);
  border-top: 1px solid #e0e0e0;
  margin-top: 0.5rem;
  border-radius: 0 0 8px 8px;
}

.info-btn {
  padding: 0.8rem 2rem;
  background: var(--color-primary, #2c3e50);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: var(--font-paragraph-family, Arial, sans-serif);
  font-size: var(--font-paragraph-size, 1rem);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
  text-align: center;
  min-width: 200px;
  box-sizing: border-box;
}

.info-btn:hover {
  background: var(--color-secondary, #3498db);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
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

.field-hint {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--color-secondary);
  font-style: italic;
}

/* Estilos para el modal de compañía mejorado */
.company-basic-info {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid var(--color-secondary);
  margin-bottom: 1rem;
}

.modal-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-background), transparent);
  margin: 1.5rem 0;
}

.section-subtitle {
  font-family: var(--font-subtitle-family);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-background);
}

.coordinates-section {
  margin-bottom: 1rem;
}

.coordinates-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.coordinate-value {
  font-family: monospace;
  font-weight: 600;
  color: var(--color-secondary);
  background: #e3f2fd;
  border-color: var(--color-secondary);
}

.address-section {
  margin-bottom: 1rem;
}

.auto-field {
  background: linear-gradient(135deg, #fff3e0 0%, #ffffff 100%);
  border-left: 3px solid #ff9800;
}

.usage-instructions {
  background: #e8f5e8;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
  margin: 1.5rem 0;
}

.instruction-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2e7d32;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-background);
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

.image-preview {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 2px solid var(--color-background);
  border-radius: 8px;
  background: #f9f9f9;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  width: auto;
  height: auto;
  border-radius: 8px;
  border: 2px solid var(--color-secondary);
  display: block;
  margin: 0.5rem 0;
}

.image-upload-section {
  margin-bottom: 1rem;
}

.upload-label {
  cursor: pointer;
  display: inline-block;
}

.file-input {
  display: none;
}

.upload-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--color-secondary);
  color: white;
  border-radius: 8px;
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.upload-button:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f0f8ff;
  border-radius: 6px;
  border: 1px solid var(--color-secondary);
}

.file-name {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  flex: 1;
}

.clear-file-btn {
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-file-btn:hover {
  background: #c0392b;
}

.url-input-section {
  margin-top: 1rem;
}

.form-label-small {
  font-family: var(--font-paragraph-family);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.5rem;
  display: block;
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
    margin: 0.5rem;
    padding: 0.5rem;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .profile-form {
    padding: 1rem;
    margin: 0;
    box-sizing: border-box;
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
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 1rem 0;
  }
  
  .nav-btn {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .map-step {
    height: auto;
    min-height: auto;
    padding: 0;
    margin: 0;
  }
  
  .map-container {
    margin: 0;
    padding: 0;
    height: auto;
    min-height: 350px;
  }
  
  .map {
    min-height: 300px;
    max-height: 400px;
    width: 100%;
    border-radius: 4px;
  }
  
  .company-info-section {
    margin-bottom: 1rem;
    padding: 0.75rem;
  }
  
  .step-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  .modal-content {
    margin: 1rem;
    padding: 1rem;
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
    box-sizing: border-box;
  }
  
  .modal-grid {
    gap: 0.75rem;
  }
  
  .coordinates-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .company-basic-info {
    padding: 0.75rem;
  }
  
  .usage-instructions {
    padding: 0.75rem;
    margin: 1rem 0;
  }
  
  .info-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    width: 100%;
    max-width: 300px;
  }
  
  .map-actions {
    padding: 1rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    margin: 0.25rem;
    padding: 0.25rem;
  }
  
  .profile-form {
    padding: 0.75rem;
  }
  
  .step-title {
    font-size: 1.1rem;
    text-align: center;
  }
  
  .company-info-section {
    padding: 0.5rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-label {
    font-size: 0.9rem;
  }
  
  .form-input {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .map {
    min-height: 250px;
    max-height: 300px;
  }
  
  .modal-content {
    margin: 0.5rem;
    padding: 0.75rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
  }
  
  .company-basic-info {
    padding: 0.5rem;
  }
  
  .usage-instructions {
    padding: 0.5rem;
    margin: 0.75rem 0;
  }
  
  .instruction-text {
    font-size: 0.8rem;
  }
  
  .info-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>