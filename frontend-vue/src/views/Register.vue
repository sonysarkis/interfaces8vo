<script setup lang="ts">
// Lógica para la página de registro
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Crear Cuenta</h1>
      <form class="register-form">
        <div class="form-group">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            class="form-input" 
            placeholder="tu@email.com"
            required
          >
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            class="form-input" 
            placeholder="Tu contraseña"
            required
          >
        </div>
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword" 
            class="form-input" 
            placeholder="Confirma tu contraseña"
            required
          >
        </div>
        <button type="submit" class="register-button">
          Crear Cuenta
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: 1rem;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-title {
  font-family: var(--font-title-family);
  font-size: var(--font-title-size);
  font-weight: var(--font-title-weight);
  color: var(--font-title-color);
  text-align: center;
  margin-bottom: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  color: var(--font-paragraph-color);
  font-weight: 600;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid var(--color-background);
  border-radius: 8px;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--font-body-color);
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-secondary);
}

.form-input::placeholder {
  color: var(--color-text);
  opacity: 0.7;
}

.register-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.register-button:hover {
  background-color: var(--color-secondary);
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }
  
  .register-title {
    font-size: 2rem;
  }
}
</style> 