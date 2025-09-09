<template>
  <div class="user-list-container">
    <div class="header-section">
      <h1 class="page-title">Lista de Usuarios</h1>
      <p class="page-subtitle">Gestiona y visualiza todos los usuarios de la plataforma</p>
      <button @click="downloadPDF" class="btn-download-pdf" :disabled="users.length === 0">
        📄 Descargar PDF
      </button>
    </div>

    <div class="table-container">
      <table id="usersTable" class="display" style="width:100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Los datos se cargarán dinámicamente -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const router = useRouter();
let dataTable: any = null;
const users = ref<any[]>([]);
const loading = ref(true);

// Función para cargar usuarios desde la API
const loadUsers = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem('token');
    console.log('Token obtenido:', token);
    
    if (!token) {
      await Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'No se encontró token de autenticación'
      });
      router.push('/login');
      return;
    }

    const response = await fetch('/admin-auth/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Respuesta del servidor:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Datos recibidos del backend:', data);
    users.value = Array.isArray(data) ? data : [];
    console.log('Usuarios procesados:', users.value);
    
    // Inicializar DataTable después de cargar los datos
    initializeDataTable();
    
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los usuarios. Inténtalo de nuevo.'
    });
  } finally {
    loading.value = false;
  }
};

// Función para inicializar DataTable
const initializeDataTable = () => {
  if (dataTable) {
    dataTable.destroy();
  }

  const tableData = users.value.map(user => [
    user.id,
    user.nombre || 'N/A',
    user.email || 'N/A',
    user.telefono || 'N/A',
    user.type === 'admin' ? 'Administrador' : 'Usuario',
    user.status === 'active' ? 'Activo' : 'Inactivo',
    `<button class="btn-details" data-user-id="${user.id}">Ver Detalles</button>`
  ]);
  
  console.log('Datos para DataTable:', tableData);

  dataTable = new DataTable('#usersTable', {
    data: tableData,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
    },
    columnDefs: [
      {
        targets: 6, // Columna de acciones
        orderable: false,
        searchable: false,
        className: 'text-center'
      }
    ],
    pageLength: 10,
    lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
    order: [[0, 'desc']] // Ordenar por ID descendente
  });

  // Agregar event listeners para los botones de detalles
  document.addEventListener('click', handleDetailsClick);
};

// Función para manejar clics en botones de detalles
const handleDetailsClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('btn-details')) {
    const userId = target.getAttribute('data-user-id');
    if (userId) {
      goToUserDetails(userId);
    }
  }
};

// Función para ir a los detalles del usuario
const goToUserDetails = (userId: string) => {
  router.push(`/usuarios/${userId}`);
};

// Función para refrescar la tabla
const refreshTable = async () => {
  await loadUsers();
};

// Función para generar y descargar PDF
const downloadPDF = () => {
  if (users.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Sin datos',
      text: 'No hay usuarios para exportar'
    });
    return;
  }

  try {
    // Crear nuevo documento PDF
    const doc = new jsPDF();
    
    // Agregar logo de cara sonriente en la parte superior izquierda
    const logoText = '😊';
    doc.setFontSize(20);
    doc.text(logoText, 20, 30);
    
    // Título del documento
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Lista de Usuarios de la Plataforma', 50, 30);
    
    // Fecha de generación
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado el: ${currentDate}`, 50, 40);
    
    // Preparar datos para la tabla
    const tableData = users.value.map(user => [
      user.id,
      user.nombre || 'N/A',
      user.email || 'N/A',
      user.telefono || 'N/A',
      user.type === 'admin' ? 'Administrador' : 'Usuario',
      user.status === 'active' ? 'Activo' : 'Inactivo'
    ]);
    
    // Configurar la tabla
    const tableConfig = {
      head: [['ID', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Estado']],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak' as const
      },
      headStyles: {
        fillColor: [52, 152, 219] as [number, number, number],
        textColor: 255,
        fontStyle: 'bold' as const
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245] as [number, number, number]
      },
      columnStyles: {
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 35 }, // Nombre
        2: { cellWidth: 45 }, // Email
        3: { cellWidth: 25 }, // Teléfono
        4: { cellWidth: 25 }, // Tipo
        5: { cellWidth: 20 }  // Estado
      }
    };
    
    // Agregar la tabla al PDF
    autoTable(doc, tableConfig);
    
    // Agregar pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Página ${i} de ${pageCount}`, 20, doc.internal.pageSize.height - 10);
      doc.text(`Total de usuarios: ${users.value.length}`, doc.internal.pageSize.width - 60, doc.internal.pageSize.height - 10);
    }
    
    // Descargar el PDF
    doc.save(`usuarios_${new Date().toISOString().split('T')[0]}.pdf`);
    
        Swal.fire({
          icon: 'success',
      title: 'PDF Generado',
      text: 'El archivo PDF se ha descargado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al generar PDF:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo generar el PDF. Inténtalo de nuevo.'
    });
  }
};

onMounted(async () => {
  await loadUsers();
});

onUnmounted(() => {
  if (dataTable) {
    dataTable.destroy();
  }
  document.removeEventListener('click', handleDetailsClick);
});
</script>

<style scoped>
.user-list-container {
  min-height: 100vh;
  background: var(--color-background);
  padding: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: var(--font-title-size);
  font-family: var(--font-title-family);
  font-weight: var(--font-title-weight);
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: var(--font-subtitle-size);
  font-family: var(--font-subtitle-family);
  font-weight: var(--font-subtitle-weight);
  color: var(--color-text);
  margin-bottom: 1rem;
}

.btn-download-pdf {
  background: var(--color-accent);
  color: var(--color-background);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.btn-download-pdf:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btn-download-pdf:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.table-container {
  background: var(--color-background);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

/* Estilos para DataTable */
:deep(.dataTables_wrapper) {
  font-family: var(--font-body-family);
}

:deep(.dataTables_wrapper .dataTables_length),
:deep(.dataTables_wrapper .dataTables_filter),
:deep(.dataTables_wrapper .dataTables_info),
:deep(.dataTables_wrapper .dataTables_processing),
:deep(.dataTables_wrapper .dataTables_paginate) {
  color: var(--color-text);
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
}

:deep(.dataTables_wrapper .dataTables_length select),
:deep(.dataTables_wrapper .dataTables_filter input) {
  background: var(--color-background);
  color: var(--color-text);
  border: 2px solid var(--color-primary);
  border-radius: 6px;
  padding: 0.5rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
}

:deep(.dataTables_wrapper .dataTables_length select:focus),
:deep(.dataTables_wrapper .dataTables_filter input:focus) {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

:deep(.dataTables_wrapper table.dataTable) {
  border-collapse: collapse;
  width: 100%;
  margin-top: 1rem;
}

:deep(.dataTables_wrapper table.dataTable thead th) {
  background: var(--color-primary);
  color: var(--color-background);
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
  padding: 1rem;
  text-align: left;
  border: 1px solid var(--color-secondary);
}

:deep(.dataTables_wrapper table.dataTable tbody td) {
  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  padding: 1rem;
  border: 1px solid var(--color-secondary);
  vertical-align: middle;
}

:deep(.dataTables_wrapper table.dataTable tbody tr:hover) {
  background: rgba(52, 152, 219, 0.1);
}

:deep(.dataTables_wrapper .dataTables_paginate .paginate_button) {
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-primary);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.dataTables_wrapper .dataTables_paginate .paginate_button:hover) {
  background: var(--color-primary);
  color: var(--color-background);
  border-color: var(--color-primary);
}

:deep(.dataTables_wrapper .dataTables_paginate .paginate_button.current) {
  background: var(--color-secondary);
  color: var(--color-background);
  border-color: var(--color-secondary);
}

/* Estilos para botones de exportación */
:deep(.dt-buttons) {
  margin-bottom: 1rem;
}

:deep(.dt-buttons .btn-export) {
  background: var(--color-primary);
  color: var(--color-background);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  margin-right: 0.5rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.dt-buttons .btn-export:hover) {
  background: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilos para botón de detalles */
.btn-details {
  background: var(--color-accent);
  color: var(--color-background);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-details:hover {
  background: var(--color-secondary);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .user-list-container {
    padding: 1rem;
  }
  
  .table-container {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .user-list-container {
    padding: 0.5rem;
  }
  
  .table-container {
    padding: 0.5rem;
  }
  
  :deep(.dataTables_wrapper table.dataTable thead th),
  :deep(.dataTables_wrapper table.dataTable tbody td) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>