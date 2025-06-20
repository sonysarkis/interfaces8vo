<script setup lang="ts">
import { ref, computed } from 'vue';

const formData = ref({
  name: '',
  email: '',
  message: ''
});

const isFormInvalid = computed(() => {
  return !formData.value.name || !formData.value.email || !formData.value.message;
});

const onSubmit = () => {
  if (isFormInvalid.value) {
    return;
  }
  console.log('Form submitted:', formData.value);
  alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
  formData.value = {
    name: '',
    email: '',
    message: ''
  };
};
</script>

<template>
  <section class="form-section">
    <div class="form-container">
      <h2>Contáctanos</h2>
      <p class="subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte.</p>
      
      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            v-model="formData.name" 
            required>
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            v-model="formData.email" 
            required>
        </div>

        <div class="form-group">
          <label for="message">Mensaje</label>
          <textarea 
            id="message" 
            name="message" 
            v-model="formData.message" 
            required
            rows="5"></textarea>
        </div>

        <button type="submit" :disabled="isFormInvalid">
          Enviar Mensaje
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.form-section {
  padding: 4rem 2rem;
  background-color: var(--color-primary);
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-primary);
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: none;
  border: 2px solid var(--color-primary);
}

h2, .subtitle, label, .error-message {
  color: var(--color-background);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--color-background);
  border-radius: 0.375rem;
  font-size: 1rem;
  background: var(--color-primary);
  color: var(--color-background);
  transition: border-color 0.2s;
  resize: none;
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-background);
  box-shadow: 0 0 0 3px rgba(236, 240, 241, 0.1);
}

.error-message {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-background);
  color: var(--color-primary);
  border: 2px solid var(--color-background);
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

button:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--color-background);
  border: 2px solid var(--color-background);
}

button:disabled {
  background-color: var(--color-background);
  color: var(--color-primary);
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 