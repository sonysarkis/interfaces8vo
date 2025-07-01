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
    <h1 class="page-title">Detalle de Usuario</h1>
    <div v-if="user" class="user-detail">
      <div class="user-header">
        <img :src="user.image" alt="Foto de usuario" class="user-image" />
        <div class="user-basic-info">
          <h2 class="user-name">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="user-email">{{ user.email }}</p>
        </div>
      </div>
      
      <div class="user-info-grid">
        <div class="info-section">
          <h3 class="section-title">Información Personal</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">ID:</span>
              <span class="info-value">{{ user.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Nombre:</span>
              <span class="info-value">{{ user.firstName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Apellido:</span>
              <span class="info-value">{{ user.lastName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Segundo Apellido:</span>
              <span class="info-value">{{ user.maidenName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Edad:</span>
              <span class="info-value">{{ user.age }} años</span>
            </div>
            <div class="info-item">
              <span class="info-label">Género:</span>
              <span class="info-value">{{ user.gender === 'female' ? 'Femenino' : 'Masculino' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Teléfono:</span>
              <span class="info-value">{{ user.phone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Usuario:</span>
              <span class="info-value">{{ user.username }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Fecha de nacimiento:</span>
              <span class="info-value">{{ user.birthDate }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Grupo sanguíneo:</span>
              <span class="info-value">{{ user.bloodGroup }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Altura:</span>
              <span class="info-value">{{ user.height }} cm</span>
            </div>
            <div class="info-item">
              <span class="info-label">Peso:</span>
              <span class="info-value">{{ user.weight }} kg</span>
            </div>
            <div class="info-item">
              <span class="info-label">Color de ojos:</span>
              <span class="info-value">{{ user.eyeColor }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Pelo:</span>
              <span class="info-value">{{ user.hair.color }} ({{ user.hair.type }})</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Dirección</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Dirección:</span>
              <span class="info-value">{{ user.address.address }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Ciudad:</span>
              <span class="info-value">{{ user.address.city }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span class="info-value">{{ user.address.state }} ({{ user.address.stateCode }})</span>
            </div>
            <div class="info-item">
              <span class="info-label">País:</span>
              <span class="info-value">{{ user.address.country }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Código Postal:</span>
              <span class="info-value">{{ user.address.postalCode }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Coordenadas:</span>
              <span class="info-value">Lat: {{ user.address.coordinates.lat }}, Lng: {{ user.address.coordinates.lng }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información Profesional</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Universidad:</span>
              <span class="info-value">{{ user.university }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Compañía:</span>
              <span class="info-value">{{ user.company.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Departamento:</span>
              <span class="info-value">{{ user.company.department }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cargo:</span>
              <span class="info-value">{{ user.company.title }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">EIN:</span>
              <span class="info-value">{{ user.ein }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">SSN:</span>
              <span class="info-value">{{ user.ssn }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información Bancaria</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Tipo de tarjeta:</span>
              <span class="info-value">{{ user.bank.cardType }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Número:</span>
              <span class="info-value">{{ user.bank.cardNumber }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Expiración:</span>
              <span class="info-value">{{ user.bank.cardExpire }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">IBAN:</span>
              <span class="info-value">{{ user.bank.iban }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Moneda:</span>
              <span class="info-value">{{ user.bank.currency }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información Técnica</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">IP:</span>
              <span class="info-value">{{ user.ip }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">MAC:</span>
              <span class="info-value">{{ user.macAddress }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">User Agent:</span>
              <span class="info-value user-agent">{{ user.userAgent }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Criptomoneda:</span>
              <span class="info-value">{{ user.crypto.coin }} ({{ user.crypto.network }})</span>
            </div>
            <div class="info-item">
              <span class="info-label">Wallet:</span>
              <span class="info-value wallet">{{ user.crypto.wallet }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Rol:</span>
              <span class="info-value role-badge">{{ user.role }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <span :class="['status-badge', user.disabled ? 'disabled' : 'enabled']">
                {{ user.disabled ? 'Deshabilitado' : 'Activo' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="disableUser" :disabled="user.disabled" class="btn btn-danger">
          Deshabilitar usuario
        </button>
        <button @click="router.push('/usuarios')" class="btn btn-secondary">
          Volver al listado
        </button>
      </div>
    </div>
    <div v-else class="not-found">
      <p>Usuario no encontrado.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
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

.user-detail {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-background);
}

.user-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-secondary);
}

.user-basic-info {
  flex: 1;
}

.user-name {
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.user-email {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  margin: 0;
}

.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.info-section {
  background: var(--color-background);
  border-radius: 8px;
  padding: 1.5rem;
}

.section-title {
  font-family: var(--font-subtitle-family);
  font-size: 1.2rem;
  font-weight: var(--font-subtitle-weight);
  color: var(--color-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-secondary);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  color: var(--color-primary);
  min-width: 140px;
  flex-shrink: 0;
}

.info-value {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  text-align: right;
  flex: 1;
  word-break: break-word;
}

.user-agent, .wallet {
  font-family: monospace;
  font-size: 0.85rem;
  background: rgba(0,0,0,0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  word-break: break-all;
}

.role-badge {
  background: var(--color-secondary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.enabled {
  background: #10b981;
  color: white;
}

.disabled {
  background: var(--color-accent);
  color: white;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-background);
}

.btn {
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-secondary);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-danger {
  background: var(--color-accent);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-1px);
}

.not-found {
  text-align: center;
  padding: 3rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
}

@media (max-width: 768px) {
  .container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .user-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .info-label {
    min-width: auto;
  }
  
  .info-value {
    text-align: left;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 