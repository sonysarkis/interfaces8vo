<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const emit = defineEmits(['logout']);
const router = useRouter();

const isLoggedIn = ref(false);
const userType = ref('');
const isMenuOpen = ref(false);
const selectedOption = ref('');
const userId = ref('');

const checkLogin = () => {
  isLoggedIn.value = !!localStorage.getItem('token');
  userType.value = localStorage.getItem('type') || '';
  userId.value = localStorage.getItem('id') || '1';
};

onMounted(() => {
  checkLogin();
  window.addEventListener('storage', checkLogin);
});

onUnmounted(() => {
  window.removeEventListener('storage', checkLogin);
});

const onLogoutClick = () => {
  emit('logout');
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleNavClick = (sectionId: string) => {
  scrollToSection(sectionId);
  closeMenu();
};

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleSelectChange = () => {
  if (selectedOption.value) {
    router.push(selectedOption.value);
    selectedOption.value = ''; // Reset select
    closeMenu();
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <a @click="handleNavClick('inicio')" class="logo-text">Ø=Þ</a>
      </div>
      <button class="hamburger" @click="toggleMenu" aria-label="Abrir menú">
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
      </button>
      <div class="nav-links" :class="{ open: isMenuOpen }">
        <!-- Enlaces de navegación básica -->
        <a @click="handleNavClick('inicio')">Inicio</a>
        <a @click="handleNavClick('servicios')">Servicios</a>
        <a @click="handleNavClick('contacto')">Contacto</a>
        <a @click="handleNavClick('beneficios')">Beneficios</a>
        
        <!-- Select con opciones adicionales (solo para usuarios logueados) -->
        <div v-if="isLoggedIn" class="select-container">
          <select 
            v-model="selectedOption" 
            @change="handleSelectChange"
            class="nav-select"
          >
            <option value="">Más opciones...</option>
            <option value="/subir-imagen">Subir Imagen</option>
            <option value="/subir-video">Subir Video</option>
            <option value="/personalization">Personalización</option>
            <option value="/usuarios">Lista de usuarios</option>
            <option :value="`/usuarios/${userId}`">Detalles del usuario</option>
          </select>
        </div>
        
        <!-- Autenticación y perfil -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" @click="closeMenu">Iniciar Sesión</router-link>
          <router-link to="/registro" @click="closeMenu">Registrarse</router-link>
        </template>
        <template v-else>
          <router-link to="/perfil" @click="closeMenu">Perfil</router-link>
          <button class="logout-btn" @click="onLogoutClick(); closeMenu()">Cerrar sesión</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--color-background);
  box-shadow: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 2rem;
}

.logo {
  position: absolute;
  left: 1rem;
}

.logo-text {
  font-size: 2.5rem;
  font-family: var(--font-title-family);
  font-weight: var(--font-title-weight);
  color: var(--color-primary);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  user-select: none;
}

.logo-text:hover {
  color: var(--color-secondary);
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s;
}

.nav-links a, .nav-links button {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  background: none;
  border: none;
  padding: 0;
}

.nav-links a:hover, .nav-links button:hover {
  color: var(--color-accent);
}

.nav-links a.router-link-active {
  color: var(--color-secondary);
}

.logout-btn {
  color: var(--color-text);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  transition: color 0.2s;
}

.logout-btn:hover {
  color: var(--color-accent);
}

.select-container {
  position: relative;
}

.nav-select {
  background-color: transparent;
  color: var(--color-text);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  padding-right: 2rem;
  min-width: 140px;
}

.nav-select:hover {
  background-color: rgba(var(--color-primary-rgb, 44, 62, 80), 0.1);
  color: var(--color-primary);
}

.nav-select:focus {
  outline: none;
  background-color: rgba(var(--color-primary-rgb, 44, 62, 80), 0.1);
}

.nav-select option {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 0.5rem;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1100;
}
.hamburger span {
  display: block;
  width: 28px;
  height: 4px;
  margin: 4px 0;
  background: var(--color-primary);
  border-radius: 2px;
  transition: 0.4s;
}
.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger span.open:nth-child(2) {
  opacity: 0;
}
.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

@media (max-width: 900px) {
  .navbar-container {
    justify-content: space-between;
    gap: 1rem;
  }
  
  .logo-text {
    font-size: var(--font-subtitle-size);
  }
  
  .hamburger {
    display: flex;
    position: absolute;
    right: 1rem;
  }
  
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-background);
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem 0 1rem 0;
    display: none;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
  .nav-links.open {
    display: flex;
  }
  
  .nav-select {
    width: 200px;
    text-align: center;
    background-color: rgba(var(--color-primary-rgb, 44, 62, 80), 0.05);
  }
  
  .select-container {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: var(--font-body-size);
    font-size: calc(var(--font-body-size) * 1.8);
  }
  
  .navbar-container {
    padding: 0.75rem;
  }
}
</style> 