<script setup lang="ts">
const services = [
  {
    icon: 'fas fa-laptop-code',
    title: 'Desarrollo Web',
    description: 'Creamos sitios web modernos y responsivos utilizando las últimas tecnologías.'
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Aplicaciones Móviles',
    description: 'Desarrollamos aplicaciones móviles nativas y multiplataforma.'
  },
  {
    icon: 'fas fa-server',
    title: 'Servicios en la Nube',
    description: 'Ofrecemos soluciones de hosting y servicios en la nube escalables.'
  },
  {
    icon: 'fas fa-shield-alt',
    title: 'Ciberseguridad',
    description: 'Protegemos tus sistemas y datos con las mejores prácticas de seguridad.'
  }
];
</script>

<template>
  <section class="services-section">
    <h2>Nuestros Servicios</h2>
    <div class="services-grid">
      <div class="service-card" v-for="service in services" :key="service.title">
        <div class="service-icon">
          <i :class="service.icon"></i>
        </div>
        <h3>{{ service.title }}</h3>
        <p>{{ service.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services-section {
  padding: 4rem 2rem;
  background-color: var(--color-background);
}

h2 {
  text-align: center;
  font-size: var(--font-title-size);
  font-family: var(--font-title-family);
  font-weight: var(--font-title-weight);
  color: var(--color-primary);
  margin-bottom: 3rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  background: var(--color-primary);
  color: var(--color-background);
  border-radius: 0.5rem;
  box-shadow: none;
  text-align: center;
  transition: transform 0.2s;
  border: 2px solid var(--color-primary);
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-icon {
  font-size: 2.5rem;
  color: var(--color-background);
  margin-bottom: 1rem;
}

h3 {
  color: var(--color-background);
  margin-bottom: 1rem;
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
}

p {
  color: var(--color-background);
  line-height: 1.5;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  font-weight: var(--font-body-weight);
}
</style> 