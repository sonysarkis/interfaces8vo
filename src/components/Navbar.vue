<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';

const emit = defineEmits(['logout']);


const isLoggedIn = ref(false);
const userType = ref('');
const isMenuOpen = ref(false);

const checkLogin = () => {
  isLoggedIn.value = !!localStorage.getItem('token');
  userType.value = localStorage.getItem('type') || '';
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
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <a @click="handleNavClick('inicio')" class="logo-text">Landing</a>
      </div>
      <button class="hamburger" @click="toggleMenu" aria-label="Abrir menú">
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
      </button>
      <div class="nav-links" :class="{ open: isMenuOpen }">
        <a @click="handleNavClick('inicio')">Inicio</a>
        <a @click="handleNavClick('servicios')">Servicios</a>
        <a @click="handleNavClick('contacto')">Contacto</a>
        <a @click="handleNavClick('beneficios')">Beneficios</a>
        <template v-if="!isLoggedIn">
          <router-link to="/login" @click="closeMenu">Iniciar Sesión</router-link>
          <router-link to="/registro" @click="closeMenu">Registrarse</router-link>
        </template>
        <template v-else>
          <template v-if="userType === 'admin'">
            <router-link to="/personalization" @click="closeMenu">Personalización</router-link>
            <router-link to="/usuarios" @click="closeMenu">Usuarios</router-link>
            <router-link to="/perfil" @click="closeMenu">Perfil</router-link>
          </template>
          <template v-else>
            <router-link to="/perfil" @click="closeMenu">Perfil</router-link>
          </template>
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
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo-text {
  font-size: var(--font-title-size);
  font-family: var(--font-title-family);
  font-weight: var(--font-title-weight);
  color: var(--color-primary);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.logo-text:hover {
  color: var(--color-accent);
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
  .hamburger {
    display: flex;
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
}
</style> 