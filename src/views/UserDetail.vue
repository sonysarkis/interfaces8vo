<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const user = ref<any>(null);
const editableUser = ref<any>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string>('');

function backendToUser(data: any) {
  return {
    id: data.id,
    firstName: data.nombre || '',
    lastName: data.apellido || '',
    maidenName: data.segundo_apellido || '',
    age: data.edad || '',
    gender: data.genero || '',
    email: data.email || '',
    ip: data.ip || '',
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
        role: data.type || '',
        disabled: data.status === 'inactive'
      };
}

async function fetchUserDetail() {
  const id = route.params.id;
  const token = localStorage.getItem('token');
  
  if (!id || !token) {
    user.value = null;
    editableUser.value = null;
    return;
  }
  
  try {
    const res = await fetch(`/admin-auth/user/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      user.value = backendToUser(data);
      editableUser.value = { ...user.value };
    } else {
      user.value = null;
      editableUser.value = null;
    }
  } catch (e) {
    user.value = null;
    editableUser.value = null;
  }
}

function disableUser() {
  if (editableUser.value) editableUser.value.disabled = true;
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
      if (editableUser.value) {
        editableUser.value.image = previewUrl.value;
      }
    };
    reader.readAsDataURL(file);
  }
}

// Función para limpiar la selección de archivo
function clearFileSelection() {
  selectedFile.value = null;
  previewUrl.value = '';
  const fileInput = document.getElementById('file-input-detail') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

// Función para subir archivo (simulada)
async function uploadFile(): Promise<string | null> {
  if (!selectedFile.value) return null;
  
  try {
    // Simulación: retornamos la URL de vista previa
    // En producción aquí iría la lógica real de subida
    return previewUrl.value;
    
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    alert('Error al subir el archivo');
    return null;
  }
}

function userToBackend(userData: any) {
  return {
    email: userData.email,
    type: userData.role,
    status: userData.disabled ? 'inactive' : 'active',
    nombre: userData.firstName,
    apellido: userData.lastName,
    segundo_apellido: userData.maidenName,
    edad: userData.age,
    genero: userData.gender,
    telefono: userData.phone,
    username: userData.username,
    password: userData.password || '', // Solo si se proporciona nueva contraseña
    fecha_nacimiento: userData.birthDate,
    grupo_sanguineo: userData.bloodGroup,
    altura: userData.height,
    peso: userData.weight,
    color_ojos: userData.eyeColor,
    pelo_color: userData.hair?.color || '',
    pelo_tipo: userData.hair?.type || '',
    ip: userData.ip,
    imagen: userData.image,
    direccion: userData.address?.address || '',
    ciudad: userData.address?.city || '',
    estado: userData.address?.state || '',
    estado_code: userData.address?.stateCode || '',
    pais: userData.address?.country || '',
    codigo_postal: userData.address?.postalCode || '',
    coord_lat: userData.address?.coordinates?.lat || 0,
    coord_lng: userData.address?.coordinates?.lng || 0,
    banco_tipo_tarjeta: userData.bank?.cardType || '',
    banco_numero_tarjeta: userData.bank?.cardNumber || '',
    banco_expiracion: userData.bank?.cardExpire || '',
    banco_iban: userData.bank?.iban || '',
    banco_moneda: userData.bank?.currency || '',
    compania_nombre: userData.company?.name || '',
    compania_departamento: userData.company?.department || '',
    compania_titulo: userData.company?.title || '',
    compania_direccion: userData.company?.address?.address || '',
    compania_ciudad: userData.company?.address?.city || '',
    compania_estado: userData.company?.address?.state || '',
    compania_codigo_postal: userData.company?.address?.postalCode || '',
    compania_coord_lat: userData.company?.address?.coordinates?.lat || 0,
    compania_coord_lng: userData.company?.address?.coordinates?.lng || 0,
    compania_pais: userData.company?.address?.country || '',
    mac: userData.macAddress,
    universidad: userData.university,
    ein: userData.ein,
    ssn: userData.ssn,
    user_agent: userData.userAgent,
    cripto_moneda: userData.crypto?.coin || '',
    cripto_wallet: userData.crypto?.wallet || '',
    cripto_network: userData.crypto?.network || ''
  };
}

async function applyChanges() {
  if (!editableUser.value) return;
  
  const id = route.params.id;
  const token = localStorage.getItem('token');
  
  if (!id || !token) {
    alert('Error: No se puede actualizar el usuario');
    return;
  }
  
  try {
    // Si hay un archivo seleccionado, subirlo primero
    if (selectedFile.value) {
      const uploadedUrl = await uploadFile();
      if (uploadedUrl) {
        editableUser.value.image = uploadedUrl;
      }
    }
    
    const backendData = userToBackend(editableUser.value);
    
    const res = await fetch(`/admin-auth/user/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(backendData)
    });
    
    if (res.ok) {
      const result = await res.json();
      console.log('Usuario actualizado correctamente:', result);
      alert('Cambios guardados exitosamente');
      // Actualizar el usuario original con los cambios
      if (user.value && editableUser.value) {
        Object.assign(user.value, editableUser.value);
      }
    } else {
      const error = await res.json();
      console.error('Error al actualizar usuario:', error);
      alert('Error al guardar los cambios: ' + (error.error || 'Error desconocido'));
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    alert('Error de conexión al guardar los cambios');
  }
}

onMounted(fetchUserDetail);
</script>

<template>
  <div class="container">
    <h1 class="page-title">Detalle de Usuario</h1>
    <div v-if="editableUser" class="user-detail">
      <div class="user-header">
        <img :src="previewUrl || editableUser.image" alt="Foto de usuario" class="user-image" />
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
          <div class="image-input-section">
            <label class="info-label">Imagen de perfil:</label>
            
            <!-- Opción 1: Subir archivo -->
            <div class="image-upload-section">
              <label class="upload-label">
                <input 
                  id="file-input-detail"
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
              <input 
                v-model="editableUser.image" 
                class="user-image-input"
                placeholder="URL de la imagen de perfil"
              />
            </div>
          </div>
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

.image-input-section {
  margin-top: 1rem;
  width: 100%;
}

.user-image-input {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  border: 2px solid var(--color-accent);
  border-radius: 6px;
  padding: 0.5rem;
  background: rgba(231, 76, 60, 0.05);
  transition: border-color 0.2s ease;
  width: 100%;
}

.user-image-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
  background: rgba(231, 76, 60, 0.1);
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