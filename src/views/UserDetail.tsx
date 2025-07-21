import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Tangram from '../tangram/tangram.tsx';

// --- Definición de tipos ---
type UserType = {
  id: number | string;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number | string;
  gender: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number | string;
  weight: number | string;
  eyeColor: string;
  hair: { color: string; type: string };
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    coordinates: { lat: number; lng: number };
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
      coordinates: { lat: number; lng: number };
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
};

// --- Función para transformar datos del backend ---
function backendToUser(data: any): UserType {
  return {
    id: data.id,
    firstName: data.nombre || "",
    lastName: data.apellido || "",
    maidenName: data.segundo_apellido || "",
    age: data.edad || "",
    gender: data.genero || "",
    email: data.email || "",
    phone: data.telefono || "",
    username: data.username || "",
    password: "",
    birthDate: data.fecha_nacimiento || "",
    image: data.imagen || "",
    bloodGroup: data.grupo_sanguineo || "",
    height: data.altura || "",
    weight: data.peso || "",
    eyeColor: data.color_ojos || "",
    hair: {
      color: data.pelo_color || "",
      type: data.pelo_tipo || "",
    },
    address: {
      address: data.direccion || "",
      city: data.ciudad || "",
      state: data.estado || "",
      postalCode: data.codigo_postal || "",
      coordinates: {
        lat: data.coord_lat ?? 0,
        lng: data.coord_lng ?? 0,
      },
      country: data.pais || "",
    },
    macAddress: data.mac || "",
    university: data.universidad || "",
    bank: {
      cardExpire: data.banco_expiracion || "",
      cardNumber: data.banco_numero_tarjeta || "",
      cardType: data.banco_tipo_tarjeta || "",
      currency: data.banco_moneda || "",
      iban: data.banco_iban || "",
    },
    company: {
      department: data.compania_departamento || "",
      name: data.compania_nombre || "",
      title: data.compania_titulo || "",
      address: {
        address: data.compania_direccion || "",
        city: data.compania_ciudad || "",
        state: data.compania_estado || "",
        postalCode: data.compania_codigo_postal || "",
        coordinates: {
          lat: data.compania_coord_lat ?? 0,
          lng: data.compania_coord_lng ?? 0,
        },
        country: data.compania_pais || "",
      },
    },
    ein: data.ein || "",
    ssn: data.ssn || "",
    userAgent: data.user_agent || "",
    crypto: {
      coin: data.cripto_moneda || "",
      wallet: data.cripto_wallet || "",
      network: data.cripto_network || "",
    },
    role: data.type || "",
    disabled: data.status === "inactive",
  };
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserType | null>(null);
  const [editableUser, setEditableUser] = useState<UserType | null>(null);
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

  // --- Fetch de datos ---
  useEffect(() => {
    async function fetchUserDetail() {
      const token = localStorage.getItem("token");
      const currentId = localStorage.getItem("id");
      if (currentId && String(currentId) === String(id)) {
        navigate("/perfil", { replace: true });
        return;
      }
      if (!id || !token) {
        setUser(null);
        setEditableUser(null);
        return;
      }
      try {
        const res = await fetch(`/admin-auth/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const userObj = backendToUser(data);
          setUser(userObj);
          setEditableUser({ ...userObj });
        } else {
          setUser(null);
          setEditableUser(null);
        }
      } catch {
        setUser(null);
        setEditableUser(null);
      }
    }
    fetchUserDetail();
    // eslint-disable-next-line
  }, [id]);

  // --- Handler para cambios en campos anidados ---
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    path: string[]
  ) {
    if (!editableUser) return;
    setEditableUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      let obj: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        obj[path[i]] = { ...obj[path[i]] };
        obj = obj[path[i]];
      }
      const key = path[path.length - 1];
      obj[key] =
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
      return updated;
    });
  }

  // --- Deshabilitar usuario ---
  function disableUser() {
    if (editableUser) setEditableUser({ ...editableUser, disabled: true });
  }

  // --- Aplicar cambios (solo actualiza el estado local) ---
  function applyChanges() {
    if (user && editableUser) {
      setUser({ ...editableUser });
      // Aquí iría la lógica para guardar los cambios en el backend si se desea
      console.log("Cambios aplicados:", editableUser);
    }
  }

  if (!editableUser) {
    return (
      <>
        <div className="container">
          <h1 className="page-title">Detalle de Usuario</h1>
          <div className="not-found">
            <p>Usuario no encontrado.</p>
          </div>
        </div>
        <style>{css}</style>
      </>
    );
  }

  return (
    <>
      {showLoader && (
        <div className={`tangram-loader${fadeOut ? ' fade-out' : ''}`}>
          <Tangram />
        </div>
      )}
      <div className="container">
        <h1 className="page-title">Detalle de Usuario</h1>
        <div className="user-detail">
          <div className="user-header">
            <img
              src={editableUser.image}
              alt="Foto de usuario"
              className="user-image"
            />
            <div className="user-basic-info">
              <input
                value={editableUser.firstName}
                onChange={(e) => handleInputChange(e, ["firstName"])}
                className="user-name-input"
                placeholder="Nombre"
              />
              <input
                value={editableUser.lastName}
                onChange={(e) => handleInputChange(e, ["lastName"])}
                className="user-name-input"
                placeholder="Apellido"
              />
              <input
                value={editableUser.email}
                onChange={(e) => handleInputChange(e, ["email"])}
                className="user-email-input"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="user-info-grid">
            {/* Información Personal */}
            <div className="info-section">
              <h3 className="section-title">Información Personal</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">ID:</span>
                  <input
                    value={editableUser.id}
                    onChange={(e) => handleInputChange(e, ["id"])}
                    className="info-input"
                    type="number"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Nombre:</span>
                  <input
                    value={editableUser.firstName}
                    onChange={(e) => handleInputChange(e, ["firstName"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Apellido:</span>
                  <input
                    value={editableUser.lastName}
                    onChange={(e) => handleInputChange(e, ["lastName"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Segundo Apellido:</span>
                  <input
                    value={editableUser.maidenName}
                    onChange={(e) => handleInputChange(e, ["maidenName"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Edad:</span>
                  <input
                    value={editableUser.age}
                    onChange={(e) => handleInputChange(e, ["age"])}
                    className="info-input"
                    type="number"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Género:</span>
                  <select
                    value={editableUser.gender}
                    onChange={(e) => handleInputChange(e, ["gender"])}
                    className="info-input"
                  >
                    <option value="female">Femenino</option>
                    <option value="male">Masculino</option>
                  </select>
                </div>
                <div className="info-item">
                  <span className="info-label">Teléfono:</span>
                  <input
                    value={editableUser.phone}
                    onChange={(e) => handleInputChange(e, ["phone"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Usuario:</span>
                  <input
                    value={editableUser.username}
                    onChange={(e) => handleInputChange(e, ["username"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Fecha de nacimiento:</span>
                  <input
                    value={editableUser.birthDate}
                    onChange={(e) => handleInputChange(e, ["birthDate"])}
                    className="info-input"
                    type="date"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Grupo sanguíneo:</span>
                  <input
                    value={editableUser.bloodGroup}
                    onChange={(e) => handleInputChange(e, ["bloodGroup"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Altura:</span>
                  <input
                    value={editableUser.height}
                    onChange={(e) => handleInputChange(e, ["height"])}
                    className="info-input"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Peso:</span>
                  <input
                    value={editableUser.weight}
                    onChange={(e) => handleInputChange(e, ["weight"])}
                    className="info-input"
                    type="number"
                    step="0.01"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Color de ojos:</span>
                  <input
                    value={editableUser.eyeColor}
                    onChange={(e) => handleInputChange(e, ["eyeColor"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Color de pelo:</span>
                  <input
                    value={editableUser.hair.color}
                    onChange={(e) => handleInputChange(e, ["hair", "color"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Tipo de pelo:</span>
                  <input
                    value={editableUser.hair.type}
                    onChange={(e) => handleInputChange(e, ["hair", "type"])}
                    className="info-input"
                  />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="info-section">
              <h3 className="section-title">Dirección</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Dirección:</span>
                  <input
                    value={editableUser.address.address}
                    onChange={(e) =>
                      handleInputChange(e, ["address", "address"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Ciudad:</span>
                  <input
                    value={editableUser.address.city}
                    onChange={(e) =>
                      handleInputChange(e, ["address", "city"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Estado:</span>
                  <input
                    value={editableUser.address.state}
                    onChange={(e) =>
                      handleInputChange(e, ["address", "state"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">País:</span>
                  <input
                    value={editableUser.address.country}
                    onChange={(e) =>
                      handleInputChange(e, ["address", "country"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Código Postal:</span>
                  <input
                    value={editableUser.address.postalCode}
                    onChange={(e) =>
                      handleInputChange(e, ["address", "postalCode"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Latitud:</span>
                  <input
                    value={editableUser.address.coordinates.lat}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "address",
                        "coordinates",
                        "lat",
                      ])
                    }
                    className="info-input"
                    type="number"
                    step="0.000001"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Longitud:</span>
                  <input
                    value={editableUser.address.coordinates.lng}
                    onChange={(e) =>
                      handleInputChange(e, [
                        "address",
                        "coordinates",
                        "lng",
                      ])
                    }
                    className="info-input"
                    type="number"
                    step="0.000001"
                  />
                </div>
              </div>
            </div>

            {/* Información Profesional */}
            <div className="info-section">
              <h3 className="section-title">Información Profesional</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Universidad:</span>
                  <input
                    value={editableUser.university}
                    onChange={(e) => handleInputChange(e, ["university"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Compañía:</span>
                  <input
                    value={editableUser.company.name}
                    onChange={(e) =>
                      handleInputChange(e, ["company", "name"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Departamento:</span>
                  <input
                    value={editableUser.company.department}
                    onChange={(e) =>
                      handleInputChange(e, ["company", "department"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Cargo:</span>
                  <input
                    value={editableUser.company.title}
                    onChange={(e) =>
                      handleInputChange(e, ["company", "title"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">EIN:</span>
                  <input
                    value={editableUser.ein}
                    onChange={(e) => handleInputChange(e, ["ein"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">SSN:</span>
                  <input
                    value={editableUser.ssn}
                    onChange={(e) => handleInputChange(e, ["ssn"])}
                    className="info-input"
                  />
                </div>
              </div>
            </div>

            {/* Información Bancaria */}
            <div className="info-section">
              <h3 className="section-title">Información Bancaria</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Tipo de tarjeta:</span>
                  <input
                    value={editableUser.bank.cardType}
                    onChange={(e) =>
                      handleInputChange(e, ["bank", "cardType"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Número:</span>
                  <input
                    value={editableUser.bank.cardNumber}
                    onChange={(e) =>
                      handleInputChange(e, ["bank", "cardNumber"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Expiración:</span>
                  <input
                    value={editableUser.bank.cardExpire}
                    onChange={(e) =>
                      handleInputChange(e, ["bank", "cardExpire"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">IBAN:</span>
                  <input
                    value={editableUser.bank.iban}
                    onChange={(e) =>
                      handleInputChange(e, ["bank", "iban"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Moneda:</span>
                  <input
                    value={editableUser.bank.currency}
                    onChange={(e) =>
                      handleInputChange(e, ["bank", "currency"])
                    }
                    className="info-input"
                  />
                </div>
              </div>
            </div>

            {/* Información Técnica */}
            <div className="info-section">
              <h3 className="section-title">Información Técnica</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">MAC:</span>
                  <input
                    value={editableUser.macAddress}
                    onChange={(e) => handleInputChange(e, ["macAddress"])}
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">User Agent:</span>
                  <textarea
                    value={editableUser.userAgent}
                    onChange={(e) => handleInputChange(e, ["userAgent"])}
                    className="info-textarea"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Criptomoneda:</span>
                  <input
                    value={editableUser.crypto.coin}
                    onChange={(e) =>
                      handleInputChange(e, ["crypto", "coin"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Red:</span>
                  <input
                    value={editableUser.crypto.network}
                    onChange={(e) =>
                      handleInputChange(e, ["crypto", "network"])
                    }
                    className="info-input"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Wallet:</span>
                  <textarea
                    value={editableUser.crypto.wallet}
                    onChange={(e) =>
                      handleInputChange(e, ["crypto", "wallet"])
                    }
                    className="info-textarea"
                  />
                </div>
                <div className="info-item">
                  <span className="info-label">Rol:</span>
                  <select
                    value={editableUser.role}
                    onChange={(e) => handleInputChange(e, ["role"])}
                    className="info-input"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">Usuario</option>
                  </select>
                </div>
                <div className="info-item">
                  <span className="info-label">Estado:</span>
                  <select
                    value={editableUser.disabled ? "true" : "false"}
                    onChange={(e) =>
                      setEditableUser({
                        ...editableUser,
                        disabled: e.target.value === "true",
                      })
                    }
                    className="info-input"
                  >
                    <option value="false">Activo</option>
                    <option value="true">Deshabilitado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              onClick={disableUser}
              disabled={editableUser.disabled}
              className="btn btn-danger"
            >
              Deshabilitar usuario
            </button>
            <button
              type="button"
              onClick={applyChanges}
              className="btn btn-primary"
            >
              Aplicar Cambios
            </button>
            <button
              type="button"
              onClick={() => navigate("/usuarios")}
              className="btn btn-secondary"
            >
              Volver al listado
            </button>
          </div>
        </div>
      </div>
      <style>{css}</style>
    </>
  );
};

// --- CSS embebido ---
const css = `
.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(44, 62, 80, 0.1);
}
.page-title {
  font-family: var(--font-title-family);
  font-size: var(--font-title-size);
  font-weight: var(--font-title-weight);
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
}
.user-detail {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(44, 62, 80, 0.05);
}
.user-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-background);
}
.user-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-secondary);
}
.user-basic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.user-name-input {
  font-family: var(--font-subtitle-family);
  font-size: var(--font-subtitle-size);
  font-weight: var(--font-subtitle-weight);
  color: var(--color-primary);
  border: 2px solid var(--color-background);
  border-radius: 6px;
  padding: 0.5rem;
  background: white;
  transition: border-color 0.2s ease;
}
.user-name-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
.user-email-input {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  border: 2px solid var(--color-background);
  border-radius: 6px;
  padding: 0.5rem;
  background: white;
  transition: border-color 0.2s ease;
}
.user-email-input:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}
.info-section {
  background: var(--color-background);
  border-radius: 8px;
  padding: 1.5rem;
}
.section-title {
  font-family: var(--font-subtitle-family);
  font-size: 1.2rem;
  font-weight: var(--font-subtitle-weight);
  color: var(--color-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-secondary);
}
.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(44, 62, 80, 0.05);
}
.info-item:last-child {
  border-bottom: none;
}
.info-label {
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  color: var(--color-primary);
  min-width: 140px;
  flex-shrink: 0;
}
.info-input, .info-textarea {
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
  border: 2px solid var(--color-background);
  border-radius: 6px;
  padding: 0.5rem;
  background: white;
  flex: 1;
  transition: border-color 0.2s ease;
  min-width: 0;
}
.info-input:focus, .info-textarea:focus {
  outline: none;
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
.info-textarea {
  resize: vertical;
  min-height: 60px;
  font-family: monospace;
  font-size: 0.85rem;
}
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-background);
}
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-family: var(--font-paragraph-family);
  font-size: var(--font-paragraph-size);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover:not(:disabled) {
  background: #1a252f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.2);
}
.btn-secondary {
  background: var(--color-secondary);
  color: white;
}
.btn-secondary:hover:not(:disabled) {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}
.btn-danger {
  background: var(--color-accent);
  color: white;
}
.btn-danger:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
}
.not-found {
  text-align: center;
  padding: 3rem;
  font-family: var(--font-body-family);
  font-size: var(--font-body-size);
  color: var(--color-text);
}
.tangram-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease-in-out;
}
.tangram-loader.fade-out {
  opacity: 0;
}
@media (max-width: 768px) {
  .container {
    margin: 1rem;
    padding: 1rem;
  }
  .user-header {
    flex-direction: column;
    text-align: center;
  }
  .user-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  .info-label {
    min-width: auto;
  }
  .info-input, .info-textarea {
    width: 100%;
  }
  .action-buttons {
    flex-direction: column;
  }
}
`;

export default UserDetail;