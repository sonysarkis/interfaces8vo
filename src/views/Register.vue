<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const router = useRouter()

async function onSubmit(e: Event) {
  e.preventDefault()
  if (password.value !== confirmPassword.value) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Las contraseñas no coinciden.'
    })
    return
  }

  const token = localStorage.getItem('token') || ''
  try {
    const res = await fetch('/admin-auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    const data = await res.json()
    if (!res.ok) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.error?.error || data.error || JSON.stringify(data)
      })
      return
    }
    await Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      text: 'Tu cuenta ha sido creada correctamente.'
    })
    router.push('/login')
  } catch (e) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error de red o del servidor'
    })
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Crear Cuenta</h1>
      <form class="login-form" @submit="onSubmit">
        <div class="form-group">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input type="email" id="email" class="form-input" placeholder="tu@email.com" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" id="password" class="form-input" placeholder="Tu contraseña" v-model="password"
            required>
        </div>
        <div class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
          <input type="password" id="confirmPassword" class="form-input" placeholder="Repite tu contraseña"
            v-model="confirmPassword" required>
        </div>
        <button type="submit" class="login-button">
          Registrarse
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-background);
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgb(from var(--color-primary) r g b / 0.15);
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-family: var(--font-title-family);
  font-size: var(--font-title-size);
  font-weight: var(--font-title-weight);
  color: var(--font-title-color);
  text-align: center;
  margin-bottom: 2rem;
}

.login-form {
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

.login-button {
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

.login-button:hover {
  background-color: var(--color-secondary);
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 2rem;
  }
}
</style>