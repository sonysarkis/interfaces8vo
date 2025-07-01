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

// Crear una copia editable del usuario
const editableUser = ref(user.value ? { ...user.value } : null);

function disableUser() {
  if (editableUser.value) editableUser.value.disabled = true;
}

function applyChanges() {
  // Aquí iría la lógica para guardar los cambios
  console.log('Cambios aplicados:', editableUser.value);
  // Por ahora solo actualizamos el usuario original
  if (user.value && editableUser.value) {
    Object.assign(user.value, editableUser.value);
  }
}
</script>

<template>
  <div class="container">
    <h1 class="page-title">Detalle de Usuario</h1>
    <div v-if="editableUser" class="user-detail">
      <div class="user-header">
        <img :src="editableUser.image" alt="Foto de usuario" class="user-image" />
        <div class="user-basic-info">
          <input 
            v-model="editableUser.firstName" 
            class="user-name-input"
            placeholder="Nombre"
          />
          <input 
            v-model="editableUser.lastName" 
            class="user-name-input"
            placeholder="Apellido"
          />
          <input 
            v-model="editableUser.email" 
            class="user-email-input"
            placeholder="Email"
          />
        </div>
      </div>
      
      <div class="user-info-grid">
        <div class="info-section">
          <h3 class="section-title">Información Personal</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">ID:</span>
              <input v-model="editableUser.id" class="info-input" type="number" />
            </div>
            <div class="info-item">
              <span class="info-label">Nombre:</span>
              <input v-model="editableUser.firstName" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Apellido:</span>
              <input v-model="editableUser.lastName" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Segundo Apellido:</span>
              <input v-model="editableUser.maidenName" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Edad:</span>
              <input v-model="editableUser.age" class="info-input" type="number" />
            </div>
            <div class="info-item">
              <span class="info-label">Género:</span>
              <select v-model="editableUser.gender" class="info-input">
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
              </select>
            </div>
            <div class="info-item">
              <span class="info-label">Teléfono:</span>
              <input v-model="editableUser.phone" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Usuario:</span>
              <input v-model="editableUser.username" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Fecha de nacimiento:</span>
              <input v-model="editableUser.birthDate" class="info-input" type="date" />
            </div>
            <div class="info-item">
              <span class="info-label">Grupo sanguíneo:</span>
              <input v-model="editableUser.bloodGroup" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Altura:</span>
              <input v-model="editableUser.height" class="info-input" type="number" step="0.01" />
            </div>
            <div class="info-item">
              <span class="info-label">Peso:</span>
              <input v-model="editableUser.weight" class="info-input" type="number" step="0.01" />
            </div>
            <div class="info-item">
              <span class="info-label">Color de ojos:</span>
              <input v-model="editableUser.eyeColor" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Color de pelo:</span>
              <input v-model="editableUser.hair.color" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Tipo de pelo:</span>
              <input v-model="editableUser.hair.type" class="info-input" />
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Dirección</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Dirección:</span>
              <input v-model="editableUser.address.address" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Ciudad:</span>
              <input v-model="editableUser.address.city" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <input v-model="editableUser.address.state" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Código de Estado:</span>
              <input v-model="editableUser.address.stateCode" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">País:</span>
              <input v-model="editableUser.address.country" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Código Postal:</span>
              <input v-model="editableUser.address.postalCode" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Latitud:</span>
              <input v-model="editableUser.address.coordinates.lat" class="info-input" type="number" step="0.000001" />
            </div>
            <div class="info-item">
              <span class="info-label">Longitud:</span>
              <input v-model="editableUser.address.coordinates.lng" class="info-input" type="number" step="0.000001" />
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información Profesional</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Universidad:</span>
              <input v-model="editableUser.university" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Compañía:</span>
              <input v-model="editableUser.company.name" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Departamento:</span>
              <input v-model="editableUser.company.department" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Cargo:</span>
              <input v-model="editableUser.company.title" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">EIN:</span>
              <input v-model="editableUser.ein" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">SSN:</span>
              <input v-model="editableUser.ssn" class="info-input" />
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información Bancaria</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Tipo de tarjeta:</span>
              <input v-model="editableUser.bank.cardType" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Número:</span>
              <input v-model="editableUser.bank.cardNumber" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Expiración:</span>
              <input v-model="editableUser.bank.cardExpire" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">IBAN:</span>
              <input v-model="editableUser.bank.iban" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Moneda:</span>
              <input v-model="editableUser.bank.currency" class="info-input" />
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3 class="section-title">Información Técnica</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">IP:</span>
              <input v-model="editableUser.ip" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">MAC:</span>
              <input v-model="editableUser.macAddress" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">User Agent:</span>
              <textarea v-model="editableUser.userAgent" class="info-textarea"></textarea>
            </div>
            <div class="info-item">
              <span class="info-label">Criptomoneda:</span>
              <input v-model="editableUser.crypto.coin" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Red:</span>
              <input v-model="editableUser.crypto.network" class="info-input" />
            </div>
            <div class="info-item">
              <span class="info-label">Wallet:</span>
              <textarea v-model="editableUser.crypto.wallet" class="info-textarea"></textarea>
            </div>
            <div class="info-item">
              <span class="info-label">Rol:</span>
              <select v-model="editableUser.role" class="info-input">
                <option value="admin">Admin</option>
                <option value="user">Usuario</option>
                <option value="moderator">Moderador</option>
              </select>
            </div>
            <div class="info-item">
              <span class="info-label">Estado:</span>
              <select v-model="editableUser.disabled" class="info-input">
                <option :value="false">Activo</option>
                <option :value="true">Deshabilitado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="disableUser" :disabled="editableUser.disabled" class="btn btn-danger">
          Deshabilitar usuario
        </button>
        <button @click="applyChanges" class="btn btn-primary">
          Aplicar Cambios
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
  box-shadow: 0 4px 20px rgba(44, 62, 80, 0.1);
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
  box-shadow: 0 2px 10px rgba(44, 62, 80, 0.05);
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-name-input {
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
  color: var(--color-primary);
  border: 2px solid var(--color-background);
  border-radius: 6px;
  padding: 0.5rem;
  background: white;
  transition: border-color 0.2s ease;
}

.user-name-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.user-email-input {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  border: 2px solid var(--color-background);
  border-radius: 6px;
  padding: 0.5rem;
  background: white;
  transition: border-color 0.2s ease;
}

.user-email-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
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

.info-input, .info-textarea {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  border: 2px solid var(--color-background);
  border-radius: 6px;
  padding: 0.5rem;
  background: white;
  flex: 1;
  transition: border-color 0.2s ease;
  min-width: 0;
}

.info-input:focus, .info-textarea:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.info-textarea {
  resize: vertical;
  min-height: 60px;
  font-family: monospace;
  font-size: 0.85rem;
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

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1a252f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.2);
}

.btn-secondary {
  background: var(--color-secondary);
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.btn-danger {
  background: var(--color-accent);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
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
  
  .info-input, .info-textarea {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style> 