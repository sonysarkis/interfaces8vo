import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Tipos para los objetos anidados
interface EditableUser {
  id: number | '';
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number | '';
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number | '';
  weight: number | '';
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
  disabled: boolean;
}

function backendToUser(data: any): EditableUser {
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
    address: {
      address: data.direccion || '',
      city: data.ciudad || '',
      state: data.estado || '',
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

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editableUser, setEditableUser] = useState<EditableUser | null>(null);
  const [user, setUser] = useState<EditableUser | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchUserDetail() {
      const token = localStorage.getItem('token');
      const currentId = localStorage.getItem('id');
      if (currentId && String(currentId) === String(id)) {
        navigate('/perfil');
        return;
      }
      if (!id || !token) {
        setUser(null);
        setEditableUser(null);
        setNotFound(true);
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
          const userObj = backendToUser(data);
          setUser(userObj);
          setEditableUser({ ...userObj });
          setNotFound(false);
        } else {
          setUser(null);
          setEditableUser(null);
          setNotFound(true);
        }
      } catch {
        setUser(null);
        setEditableUser(null);
        setNotFound(true);
      }
    }
    fetchUserDetail();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editableUser) return;
    const { name, value, type } = e.target;
    // Manejo de campos anidados
    if (name.includes('.')) {
      const [parent, child, subchild] = name.split('.');
      setEditableUser(prev => {
        if (!prev) return prev;
        const updated = { ...prev };
        if (subchild) {
          // Tercer nivel
          (updated as any)[parent][child][subchild] = value;
        } else {
          (updated as any)[parent][child] = value;
        }
        return updated;
      });
    } else if (type === 'number') {
      setEditableUser(prev => prev ? { ...prev, [name]: value === '' ? '' : Number(value) } : prev);
    } else if (type === 'checkbox') {
      setEditableUser(prev => prev ? { ...prev, [name]: (e.target as HTMLInputElement).checked } : prev);
    } else {
      setEditableUser(prev => prev ? { ...prev, [name]: value } : prev);
    }
  };

  const disableUser = () => {
    if (editableUser) setEditableUser({ ...editableUser, disabled: true });
  };

  const applyChanges = () => {
    if (user && editableUser) {
      setUser({ ...editableUser });
      // Aquí iría la lógica para guardar los cambios en el backend
      // Por ahora solo actualizamos el usuario original
    }
  };

  if (notFound) {
    return (
      <div className="container">
        <p className="not-found">Usuario no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Detalle de Usuario</h1>
      {editableUser && (
        <div className="user-detail">
          <div className="user-header">
            <img src={editableUser.image} alt="Foto de usuario" className="user-image" />
            <div className="user-basic-info">
              <input name="firstName" value={editableUser.firstName} onChange={handleChange} className="user-name-input" placeholder="Nombre" />
              <input name="lastName" value={editableUser.lastName} onChange={handleChange} className="user-name-input" placeholder="Apellido" />
              <input name="email" value={editableUser.email} onChange={handleChange} className="user-email-input" placeholder="Email" />
            </div>
          </div>
          <div className="user-info-grid">
            {/* Información Personal */}
            <div className="info-section">
              <h3 className="section-title">Información Personal</h3>
              <div className="info-list">
                <div className="info-item"><span className="info-label">ID:</span><input name="id" value={editableUser.id} onChange={handleChange} className="info-input" type="number" /></div>
                <div className="info-item"><span className="info-label">Nombre:</span><input name="firstName" value={editableUser.firstName} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Apellido:</span><input name="lastName" value={editableUser.lastName} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Segundo Apellido:</span><input name="maidenName" value={editableUser.maidenName} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Edad:</span><input name="age" value={editableUser.age} onChange={handleChange} className="info-input" type="number" /></div>
                <div className="info-item"><span className="info-label">Género:</span><select name="gender" value={editableUser.gender} onChange={handleChange} className="info-input"><option value="female">Femenino</option><option value="male">Masculino</option></select></div>
                <div className="info-item"><span className="info-label">Teléfono:</span><input name="phone" value={editableUser.phone} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Usuario:</span><input name="username" value={editableUser.username} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Fecha de nacimiento:</span><input name="birthDate" value={editableUser.birthDate} onChange={handleChange} className="info-input" type="date" /></div>
                <div className="info-item"><span className="info-label">Grupo sanguíneo:</span><input name="bloodGroup" value={editableUser.bloodGroup} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Altura:</span><input name="height" value={editableUser.height} onChange={handleChange} className="info-input" type="number" step="0.01" /></div>
                <div className="info-item"><span className="info-label">Peso:</span><input name="weight" value={editableUser.weight} onChange={handleChange} className="info-input" type="number" step="0.01" /></div>
                <div className="info-item"><span className="info-label">Color de ojos:</span><input name="eyeColor" value={editableUser.eyeColor} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Color de pelo:</span><input name="hair.color" value={editableUser.hair.color} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Tipo de pelo:</span><input name="hair.type" value={editableUser.hair.type} onChange={handleChange} className="info-input" /></div>
              </div>
            </div>
            {/* Dirección */}
            <div className="info-section">
              <h3 className="section-title">Dirección</h3>
              <div className="info-list">
                <div className="info-item"><span className="info-label">Dirección:</span><input name="address.address" value={editableUser.address.address} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Ciudad:</span><input name="address.city" value={editableUser.address.city} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Estado:</span><input name="address.state" value={editableUser.address.state} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">País:</span><input name="address.country" value={editableUser.address.country} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Código Postal:</span><input name="address.postalCode" value={editableUser.address.postalCode} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Latitud:</span><input name="address.coordinates.lat" value={editableUser.address.coordinates.lat} onChange={handleChange} className="info-input" type="number" step="0.000001" /></div>
                <div className="info-item"><span className="info-label">Longitud:</span><input name="address.coordinates.lng" value={editableUser.address.coordinates.lng} onChange={handleChange} className="info-input" type="number" step="0.000001" /></div>
              </div>
            </div>
            {/* Información Profesional */}
            <div className="info-section">
              <h3 className="section-title">Información Profesional</h3>
              <div className="info-list">
                <div className="info-item"><span className="info-label">Universidad:</span><input name="university" value={editableUser.university} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Compañía:</span><input name="company.name" value={editableUser.company.name} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Departamento:</span><input name="company.department" value={editableUser.company.department} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Cargo:</span><input name="company.title" value={editableUser.company.title} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">EIN:</span><input name="ein" value={editableUser.ein} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">SSN:</span><input name="ssn" value={editableUser.ssn} onChange={handleChange} className="info-input" /></div>
              </div>
            </div>
            {/* Información Bancaria */}
            <div className="info-section">
              <h3 className="section-title">Información Bancaria</h3>
              <div className="info-list">
                <div className="info-item"><span className="info-label">Tipo de tarjeta:</span><input name="bank.cardType" value={editableUser.bank.cardType} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Número:</span><input name="bank.cardNumber" value={editableUser.bank.cardNumber} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Expiración:</span><input name="bank.cardExpire" value={editableUser.bank.cardExpire} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">IBAN:</span><input name="bank.iban" value={editableUser.bank.iban} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Moneda:</span><input name="bank.currency" value={editableUser.bank.currency} onChange={handleChange} className="info-input" /></div>
              </div>
            </div>
            {/* Información Técnica */}
            <div className="info-section">
              <h3 className="section-title">Información Técnica</h3>
              <div className="info-list">
                <div className="info-item"><span className="info-label">MAC:</span><input name="macAddress" value={editableUser.macAddress} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">User Agent:</span><textarea name="userAgent" value={editableUser.userAgent} onChange={handleChange} className="info-textarea" /> </div>
                <div className="info-item"><span className="info-label">Criptomoneda:</span><input name="crypto.coin" value={editableUser.crypto.coin} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Red:</span><input name="crypto.network" value={editableUser.crypto.network} onChange={handleChange} className="info-input" /></div>
                <div className="info-item"><span className="info-label">Wallet:</span><textarea name="crypto.wallet" value={editableUser.crypto.wallet} onChange={handleChange} className="info-textarea" /> </div>
                <div className="info-item"><span className="info-label">Rol:</span><select name="role" value={editableUser.role} onChange={handleChange} className="info-input"><option value="admin">Admin</option><option value="user">Usuario</option></select></div>
                <div className="info-item"><span className="info-label">Estado:</span><select name="disabled" value={String(editableUser.disabled)} onChange={e => setEditableUser(prev => prev ? { ...prev, disabled: e.target.value === 'true' } : prev)} className="info-input"><option value="false">Activo</option><option value="true">Deshabilitado</option></select></div>
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <button onClick={disableUser} disabled={editableUser.disabled} className="btn btn-danger">Deshabilitar usuario</button>
            <button onClick={applyChanges} className="btn btn-primary">Aplicar Cambios</button>
            <button onClick={() => navigate('/usuarios')} className="btn btn-secondary">Volver al listado</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;