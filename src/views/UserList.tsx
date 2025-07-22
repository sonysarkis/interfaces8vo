import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
// Estilos de DataTables ya están incluidos en el bloque CSS de abajo
import dt from 'datatables.net-dt';
import dtButtons from 'datatables.net-buttons-dt';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import jszip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Swal from 'sweetalert2';
// Asegúrate de que la ruta de la imagen sea correcta
import logo from '../assets/image.png';
import * as XLSX from 'xlsx';
import Tangram from '../tangram/tangram.tsx';

// @ts-ignore
pdfMake.vfs = pdfFonts.vfs;
// @ts-ignore
window.JSZip = jszip;

// Estilos CSS
const styles = `
.container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    background: var(--color-background, #f4f7f9);
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
    background: var(--color-primary, #2c3e50);
    color: var(--color-background, white);
}
.display tbody tr:hover {
    background-color: #f0f0f0;
}
button {
    margin-right: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
}
button:hover {
    background-color: #e0e0e0;
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
    padding: 2rem 2.5rem 2rem 2.5rem;
    border-radius: 8px;
    min-width: 350px;
    max-width: 700px;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
    box-shadow: 0 2px 16px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
}
.modal-content .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #e74c3c;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}
.close-btn:hover {
    background: #c0392b;
}
.modal-content h2 {
    margin-top: 0;
}
.modal-content .modal-scroll {
    overflow-y: auto;
    flex: 1 1 auto;
    padding-right: 0.5rem;
}
.user-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}
.user-section:last-child {
    border-bottom: none;
}
.user-section h3 {
    margin-bottom: 0.5rem;
    color: var(--color-primary, #2c3e50);
    font-size: 1.1rem;
}
.user-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.user-section li {
    margin-bottom: 0.3rem;
    font-size: 1rem;
}
.disabled {
    color: red;
    font-weight: bold;
}
.enabled {
    color: green;
    font-weight: bold;
}
`;

const backendToUser = (data) => {
  return {
    id: data.id,
    firstName: data.nombre || '',
    lastName: data.apellido || '',
    maidenName: data.segundo_apellido || '',
    age: data.edad || '',
    gender: data.genero || '',
    email: data.email || '',
    phone: data.telefono || '',
    username: data.username || '',
    password: '',
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
    ip: data.ip || '',
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
        stateCode: data.compania_estado_code || '',
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
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const loaderSetting = localStorage.getItem('showTangramLoader');
    if (loaderSetting === null || loaderSetting === 'true') {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, []);

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowLoader(false), 1000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  const getBase64Image = useCallback((imgUrl, callback) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx && ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      callback(dataURL);
    };
  }, []);

  const downloadUserPDF = useCallback((user) => {
    getBase64Image(logo, (logoBase64) => {
      const docDefinition = {
        content: [
          {
            columns: [
              { image: logoBase64, fit: [60, 60], margin: [0, 0, 10, 0] },
              [
                { text: 'EMPRESA DEMO S.A.', style: 'header' },
                { text: 'Av. Principal 123, Ciudad, País', style: 'subheader' },
                { text: 'Tel: (000) 123-4567 | contacto@empresademo.com', style: 'subheader' },
                { text: 'RIF: J-12345678-9', style: 'subheader' }
              ]
            ]
          },
          { text: ' ', margin: [0, 0, 0, 10] },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#aaa' }] },
          { text: 'Reporte de Usuario', style: 'title', margin: [0, 15, 0, 10] },
          {
            columns: [
              { width: 'auto', text: 'Fecha de generación:' },
              { width: '*', text: new Date().toLocaleString() }
            ],
            margin: [0, 0, 0, 10]
          },
          { text: 'Datos Personales', style: 'section' },
          {
            ul: [
              `ID: ${user.id}`, `Nombre: ${user.firstName}`, `Apellido: ${user.lastName}`, `Segundo Apellido: ${user.maidenName}`,
              `Edad: ${user.age}`, `Género: ${user.gender}`, `Email: ${user.email}`, `Teléfono: ${user.phone}`, `Username: ${user.username}`,
              `Password: ${user.password}`, `Fecha de nacimiento: ${user.birthDate}`, `Grupo sanguíneo: ${user.bloodGroup}`,
              `Altura: ${user.height}`, `Peso: ${user.weight}`, `Color de ojos: ${user.eyeColor}`,
              `Pelo: ${user.hair.color} (${user.hair.type})`, `IP: ${user.ip}`
            ]
          },
          { text: 'Dirección', style: 'section' },
          {
            ul: [
              `Dirección: ${user.address.address}`, `Ciudad: ${user.address.city}`, `Estado: ${user.address.state} (${user.address.stateCode})`,
              `País: ${user.address.country}`, `Código Postal: ${user.address.postalCode}`,
              `Coordenadas: Lat: ${user.address.coordinates.lat}, Lng: ${user.address.coordinates.lng}`
            ]
          },
          { text: 'Banco', style: 'section' },
          {
            ul: [
              `Tipo de tarjeta: ${user.bank.cardType}`, `Número de tarjeta: ${user.bank.cardNumber}`, `Expiración: ${user.bank.cardExpire}`,
              `IBAN: ${user.bank.iban}`, `Moneda: ${user.bank.currency}`
            ]
          },
          { text: 'Compañía', style: 'section' },
          {
            ul: [
              `Nombre: ${user.company.name}`, `Departamento: ${user.company.department}`, `Título: ${user.company.title}`,
              `Dirección: ${user.company.address.address}`, `Ciudad: ${user.company.address.city}`,
              `Estado: ${user.company.address.state} (${user.company.address.stateCode})`, `País: ${user.company.address.country}`,
              `Código Postal: ${user.company.address.postalCode}`,
              `Coordenadas: Lat: ${user.company.address.coordinates.lat}, Lng: ${user.company.address.coordinates.lng}`
            ]
          },
          { text: 'Otros Datos', style: 'section' },
          {
            ul: [
              `MAC: ${user.macAddress}`, `Universidad: ${user.university}`, `EIN: ${user.ein}`, `SSN: ${user.ssn}`,
              `User Agent: ${user.userAgent}`, `Cripto: ${user.crypto.coin} (${user.crypto.network}) - Wallet: ${user.crypto.wallet}`,
              `Rol: ${user.role}`, `Estado: ${user.disabled ? 'Deshabilitado' : 'Activo'}`
            ]
          }
        ],
        styles: {
          header: { fontSize: 18, bold: true, color: '#2c3e50' },
          subheader: { fontSize: 10, color: '#555' },
          title: { fontSize: 16, bold: true, margin: [0, 10, 0, 10], color: '#2c3e50' },
          section: { fontSize: 13, bold: true, margin: [0, 10, 0, 4], color: '#2c3e50' }
        },
        defaultStyle: {
          fontSize: 11
        }
      };
      pdfMake.createPdf(docDefinition).download(`usuario_${user.id}.pdf`);
    });
  }, [getBase64Image]);

  const downloadUserExcel = useCallback((user) => {
    const data = [
      { Campo: 'ID', Valor: user.id }, { Campo: 'Nombre', Valor: user.firstName }, { Campo: 'Apellido', Valor: user.lastName },
      { Campo: 'Segundo Apellido', Valor: user.maidenName }, { Campo: 'Edad', Valor: user.age }, { Campo: 'Género', Valor: user.gender },
      { Campo: 'Email', Valor: user.email }, { Campo: 'Teléfono', Valor: user.phone }, { Campo: 'Username', Valor: user.username },
      { Campo: 'Password', Valor: user.password }, { Campo: 'Fecha de nacimiento', Valor: user.birthDate },
      { Campo: 'Grupo sanguíneo', Valor: user.bloodGroup }, { Campo: 'Altura', Valor: user.height }, { Campo: 'Peso', Valor: user.weight },
      { Campo: 'Color de ojos', Valor: user.eyeColor }, { Campo: 'Pelo', Valor: `${user.hair.color} (${user.hair.type})` },
      { Campo: 'IP', Valor: user.ip }, { Campo: 'Dirección', Valor: user.address.address }, { Campo: 'Ciudad', Valor: user.address.city },
      { Campo: 'Estado', Valor: `${user.address.state} (${user.address.stateCode})` }, { Campo: 'País', Valor: user.address.country },
      { Campo: 'Código Postal', Valor: user.address.postalCode },
      { Campo: 'Coordenadas', Valor: `Lat: ${user.address.coordinates.lat}, Lng: ${user.address.coordinates.lng}` },
      { Campo: 'Tipo de tarjeta', Valor: user.bank.cardType }, { Campo: 'Número de tarjeta', Valor: user.bank.cardNumber },
      { Campo: 'Expiración', Valor: user.bank.cardExpire }, { Campo: 'IBAN', Valor: user.bank.iban }, { Campo: 'Moneda', Valor: user.bank.currency },
      { Campo: 'Nombre Compañía', Valor: user.company.name }, { Campo: 'Departamento', Valor: user.company.department },
      { Campo: 'Título', Valor: user.company.title }, { Campo: 'Dirección Compañía', Valor: user.company.address.address },
      { Campo: 'Ciudad Compañía', Valor: user.company.address.city },
      { Campo: 'Estado Compañía', Valor: `${user.company.address.state} (${user.company.address.stateCode})` },
      { Campo: 'País Compañía', Valor: user.company.address.country },
      { Campo: 'Código Postal Compañía', Valor: user.company.address.postalCode },
      { Campo: 'Coordenadas Compañía', Valor: `Lat: ${user.company.address.coordinates.lat}, Lng: ${user.company.address.coordinates.lng}` },
      { Campo: 'MAC', Valor: user.macAddress }, { Campo: 'Universidad', Valor: user.university }, { Campo: 'EIN', Valor: user.ein },
      { Campo: 'SSN', Valor: user.ssn }, { Campo: 'User Agent', Valor: user.userAgent },
      { Campo: 'Cripto', Valor: `${user.crypto.coin} (${user.crypto.network}) - Wallet: ${user.crypto.wallet}` },
      { Campo: 'Rol', Valor: user.role }, { Campo: 'Estado', Valor: user.disabled ? 'Deshabilitado' : 'Activo' }
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ReporteUsuario');
    XLSX.writeFile(wb, `usuario_${user.id}.xlsx`);
  }, []);

  const showDetails = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const toggleUserStatus = useCallback(async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/admin-auth/user/${id}/status`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(prevUsers =>
          prevUsers.map(u =>
            u.id === id ? { ...u, disabled: data.result.status === 'inactive' } : u
          )
        );
        Swal.fire({
          icon: 'success',
          title: data.result.status === 'inactive' ? 'Usuario deshabilitado' : 'Usuario habilitado',
          text: data.result.status === 'inactive'
            ? 'El usuario ha sido deshabilitado correctamente.'
            : 'El usuario ha sido habilitado correctamente.'
        });
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado del usuario.'
      });
    }
  }, []);

  const goToUser = (id) => {
    navigate(`/usuarios/${id}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentId = Number(localStorage.getItem('id'));
        const res = await fetch('/admin-auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            setUsers(data.filter(u => u.id !== currentId).map(backendToUser));
          } else {
            console.error("Respuesta no es JSON:", await res.text());
          }
        } else {
          console.error("Respuesta no OK:", res.status, await res.text());
        }
      } catch (e) {
        console.error("Error fetching users:", e);
      }
    };

    fetchUsers();

    // Lógica de DataTables
    if ($.fn.dataTable && tableRef.current) {
      const table = $(tableRef.current).DataTable({
        dom: 'Bfrtip',
        buttons: [
          { extend: 'excelHtml5', text: 'Exportar a Excel', title: 'Usuarios' },
          { extend: 'pdfHtml5', text: 'Exportar a PDF', title: 'Usuarios', orientation: 'landscape', pageSize: 'A4' }
        ],
        language: { url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json' },
        retrieve: true,
      });

      return () => {
        if (tableRef.current && $.fn.dataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }
      };
    }
  }, []);

  // Inyectar estilos en el head del documento
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <>
      {showLoader && (
        <div className={`tangram-loader${fadeOut ? ' fade-out' : ''}`}>
          <Tangram />
        </div>
      )}
      <div className="container">
        <h1>Listado de Usuarios</h1>
        <table id="userTable" ref={tableRef} className="display">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} onClick={() => goToUser(user.id)} style={{ cursor: 'pointer' }}>
                <td>{user.id}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); showDetails(user); }}>Ver más</button>
                  {user.disabled ? (
                    <button onClick={(e) => { e.stopPropagation(); toggleUserStatus(user.id); }}>Habilitar</button>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); toggleUserStatus(user.id); }}>Deshabilitar</button>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); downloadUserPDF(user); }}>Reporte en PDF</button>
                  <button onClick={(e) => { e.stopPropagation(); downloadUserExcel(user); }}>Reporte en EXCEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={closeModal}>&times;</button>
              <h2>Detalles del Usuario</h2>
              <div className="modal-scroll">
                <div className="user-section">
                  <h3>Datos Personales</h3>
                  <ul>
                    <li><b>ID:</b> {selectedUser.id}</li>
                    <li><b>Nombre:</b> {selectedUser.firstName}</li>
                    <li><b>Apellido:</b> {selectedUser.lastName}</li>
                    <li><b>Segundo Apellido:</b> {selectedUser.maidenName}</li>
                    <li><b>Edad:</b> {selectedUser.age}</li>
                    <li><b>Género:</b> {selectedUser.gender}</li>
                    <li><b>Email:</b> {selectedUser.email}</li>
                    <li><b>Teléfono:</b> {selectedUser.phone}</li>
                    <li><b>Username:</b> {selectedUser.username}</li>
                    <li><b>Password:</b> {selectedUser.password}</li>
                    <li><b>Fecha de nacimiento:</b> {selectedUser.birthDate}</li>
                    <li><b>Grupo sanguíneo:</b> {selectedUser.bloodGroup}</li>
                    <li><b>Altura:</b> {selectedUser.height}</li>
                    <li><b>Peso:</b> {selectedUser.weight}</li>
                    <li><b>Color de ojos:</b> {selectedUser.eyeColor}</li>
                    <li><b>Pelo:</b> {selectedUser.hair.color} ({selectedUser.hair.type})</li>
                    <li><b>IP:</b> {selectedUser.ip}</li>
                    <li><b>Imagen:</b> <img src={selectedUser.image} alt="Foto" width="60" style={{ verticalAlign: 'middle', borderRadius: '50%' }} /></li>
                  </ul>
                </div>
                <div className="user-section">
                  <h3>Dirección</h3>
                  <ul>
                    <li><b>Dirección:</b> {selectedUser.address.address}</li>
                    <li><b>Ciudad:</b> {selectedUser.address.city}</li>
                    <li><b>Estado:</b> {selectedUser.address.state} ({selectedUser.address.stateCode})</li>
                    <li><b>País:</b> {selectedUser.address.country}</li>
                    <li><b>Código Postal:</b> {selectedUser.address.postalCode}</li>
                    <li><b>Coordenadas:</b> Lat: {selectedUser.address.coordinates.lat}, Lng: {selectedUser.address.coordinates.lng}</li>
                  </ul>
                </div>
                <div className="user-section">
                  <h3>Banco</h3>
                  <ul>
                    <li><b>Tipo de tarjeta:</b> {selectedUser.bank.cardType}</li>
                    <li><b>Número de tarjeta:</b> {selectedUser.bank.cardNumber}</li>
                    <li><b>Expiración:</b> {selectedUser.bank.cardExpire}</li>
                    <li><b>IBAN:</b> {selectedUser.bank.iban}</li>
                    <li><b>Moneda:</b> {selectedUser.bank.currency}</li>
                  </ul>
                </div>
                <div className="user-section">
                  <h3>Compañía</h3>
                  <ul>
                    <li><b>Nombre:</b> {selectedUser.company.name}</li>
                    <li><b>Departamento:</b> {selectedUser.company.department}</li>
                    <li><b>Título:</b> {selectedUser.company.title}</li>
                    <li><b>Dirección:</b> {selectedUser.company.address.address}</li>
                    <li><b>Ciudad:</b> {selectedUser.company.address.city}</li>
                    <li><b>Estado:</b> {selectedUser.company.address.state} ({selectedUser.company.address.stateCode})</li>
                    <li><b>País:</b> {selectedUser.company.address.country}</li>
                    <li><b>Código Postal:</b> {selectedUser.company.address.postalCode}</li>
                    <li><b>Coordenadas:</b> Lat: {selectedUser.company.address.coordinates.lat}, Lng: {selectedUser.company.address.coordinates.lng}</li>
                  </ul>
                </div>
                <div className="user-section">
                  <h3>Otros Datos</h3>
                  <ul>
                    <li><b>MAC:</b> {selectedUser.macAddress}</li>
                    <li><b>Universidad:</b> {selectedUser.university}</li>
                    <li><b>EIN:</b> {selectedUser.ein}</li>
                    <li><b>SSN:</b> {selectedUser.ssn}</li>
                    <li><b>User Agent:</b> {selectedUser.userAgent}</li>
                    <li><b>Cripto:</b> {selectedUser.crypto.coin} ({selectedUser.crypto.network}) - Wallet: {selectedUser.crypto.wallet}</li>
                    <li><b>Rol:</b> {selectedUser.role}</li>
                    <li><b>Estado:</b> <span className={selectedUser.disabled ? 'disabled' : 'enabled'}>{selectedUser.disabled ? 'Deshabilitado' : 'Activo'}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserList;