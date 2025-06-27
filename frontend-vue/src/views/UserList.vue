<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
// import 'datatables.net-dt/css/jquery.dataTables.css';
// import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import $ from 'jquery';
import dt from 'datatables.net-dt';
import dtButtons from 'datatables.net-buttons-dt';
// import 'datatables.net-buttons/js/buttons.html5.js';
// import 'datatables.net-buttons/js/buttons.print.js';
import jszip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Swal from 'sweetalert2';

pdfMake.vfs = pdfFonts.vfs;
// @ts-ignore
window.JSZip = jszip;

const router = useRouter();

const users = ref([
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
  // Puedes agregar más usuarios aquí si lo deseas
]);

const selectedUser = ref(null);

function showDetails(user: any) {
  selectedUser.value = user;
}

function closeModal() {
  selectedUser.value = null;
}

function disableUser(id: number) {
  const user = users.value.find(u => u.id === id);
  if (user) {
    user.disabled = true;
    Swal.fire({
      icon: 'success',
      title: 'Usuario deshabilitado',
      text: 'El usuario ha sido deshabilitado correctamente.'
    });
  }
}

function enableUser(id: number) {
  const user = users.value.find(u => u.id === id);
  if (user) {
    user.disabled = false;
    Swal.fire({
      icon: 'success',
      title: 'Usuario habilitado',
      text: 'El usuario ha sido habilitado correctamente.'
    });
  }
}

onMounted(async () => {
  await nextTick();

  // Importa dinámicamente los botones solo en el cliente
  if (typeof window !== 'undefined') {
    require('datatables.net-buttons/js/buttons.html5.js');
    require('datatables.net-buttons/js/buttons.print.js');
  }

  setTimeout(() => {
    if ($.fn.dataTable.isDataTable('#userTable')) {
      $('#userTable').DataTable().destroy();
    }
    $('#userTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        {
          extend: 'excelHtml5',
          text: 'Exportar a Excel',
          title: 'Usuarios'
        },
        {
          extend: 'pdfHtml5',
          text: 'Exportar a PDF',
          title: 'Usuarios',
          orientation: 'landscape',
          pageSize: 'A4'
        }
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
      }
    });
  }, 0);
});
</script>

<template>
  <div class="container">
    <h1>Listado de Usuarios</h1>
    <table id="userTable" class="display">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Ver más</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="showDetails(user)">Ver más</button>
            <button v-if="!user.disabled" @click="disableUser(user.id)">Deshabilitar</button>
            <button v-else @click="enableUser(user.id)">Habilitar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="selectedUser" class="modal-overlay">
      <div class="modal-content">
        <h2>Detalles del Usuario</h2>
        <pre>{{ selectedUser }}</pre>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.display {
  width: 100%;
  border-collapse: collapse;
}
.display th, .display td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}
.display th {
  background: var(--color-primary);
  color: var(--color-background);
}
button {
  margin-right: 0.5rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90vw;
  max-height: 80vh;
  overflow: auto;
}
</style> 