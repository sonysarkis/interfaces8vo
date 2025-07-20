import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Swal from "sweetalert2";
import "./Perfil.css"; // Copia el CSS aquí

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
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
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
      stateCode: string;
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
  type: string;
  status: string;
  disabled?: boolean;
};

const genderOptions = [
  { label: "Femenino", value: "female" },
  { label: "Masculino", value: "male" },
];
const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const initialUser: UserType = {
  id: 1,
  firstName: "Emily",
  lastName: "Johnson",
  maidenName: "Smith",
  age: 28,
  gender: "female",
  email: "emily.johnson@x.dummyjson.com",
  phone: "+81 965-431-3024",
  username: "emilys",
  password: "",
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
    country: "United States",
  },
  macAddress: "47:fa:41:18:ec:eb",
  university: "University of Wisconsin--Madison",
  bank: {
    cardExpire: "03/26",
    cardNumber: "9289760655481815",
    cardType: "Elo",
    currency: "CNY",
    iban: "YPUXISOBI7TTHPK2BR3HAIXL",
  },
  company: {
    department: "Engineering",
    name: "Dooley, Kozey y Cronin",
    title: "Sales Manager",
    address: {
      address: "263 Tenth Street",
      city: "San Francisco",
      state: "Wisconsin",
      stateCode: "WI",
      postalCode: "37657",
      coordinates: { lat: 71.814525, lng: -161.150263 },
      country: "United States",
    },
  },
  ein: "977-175",
  ssn: "900-590-289",
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
  crypto: {
    coin: "Bitcoin",
    wallet: "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
    network: "Ethereum (ERC20)",
  },
  type: "admin",
  status: "active",
};

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
    ip: data.ip || "",
    address: {
      address: data.direccion || "",
      city: data.ciudad || "",
      state: data.estado || "",
      stateCode: data.estado_code || "",
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
        stateCode: data.compania_estado_code || "",
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
    type: data.type || "",
    status: data.status || "",
  };
}

function mapUserToBackend(user: UserType) {
  let fecha_nacimiento = user.birthDate;
  if (fecha_nacimiento && fecha_nacimiento.length > 10) {
    fecha_nacimiento = fecha_nacimiento.slice(0, 10);
  }
  return {
    email: user.email,
    type: user.type,
    status: user.status,
    nombre: user.firstName,
    apellido: user.lastName,
    segundo_apellido: user.maidenName,
    edad: user.age,
    genero: user.gender,
    telefono: user.phone,
    username: user.username,
    fecha_nacimiento,
    imagen: user.image,
    grupo_sanguineo: user.bloodGroup,
    altura: user.height,
    peso: user.weight,
    color_ojos: user.eyeColor,
    pelo_color: user.hair?.color,
    pelo_tipo: user.hair?.type,
    ip: user.ip,
    direccion: user.address?.address,
    ciudad: user.address?.city,
    estado: user.address?.state,
    estado_code: user.address?.stateCode,
    pais: user.address?.country,
    codigo_postal: user.address?.postalCode,
    coord_lat: user.address?.coordinates?.lat,
    coord_lng: user.address?.coordinates?.lng,
    mac: user.macAddress,
    universidad: user.university,
    banco_tipo_tarjeta: user.bank?.cardType,
    banco_numero_tarjeta: user.bank?.cardNumber,
    banco_expiracion: user.bank?.cardExpire,
    banco_iban: user.bank?.iban,
    banco_moneda: user.bank?.currency,
    compania_nombre: user.company?.name,
    compania_departamento: user.company?.department,
    compania_titulo: user.company?.title,
    compania_direccion: user.company?.address?.address,
    compania_ciudad: user.company?.address?.city,
    compania_estado: user.company?.address?.state,
    compania_estado_code: user.company?.address?.stateCode,
    compania_pais: user.company?.address?.country,
    compania_codigo_postal: user.company?.address?.postalCode,
    compania_coord_lat: user.company?.address?.coordinates?.lat,
    compania_coord_lng: user.company?.address?.coordinates?.lng,
    ein: user.ein,
    ssn: user.ssn,
    user_agent: user.userAgent,
    cripto_moneda: user.crypto?.coin,
    cripto_wallet: user.crypto?.wallet,
    cripto_network: user.crypto?.network,
    password: user.password ? user.password : undefined,
  };
}

const Perfil: React.FC = () => {
  const [user, setUser] = useState<UserType>(initialUser);
  const [step, setStep] = useState(1);
  const totalSteps = 9;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Cargar datos reales del usuario al montar
  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (id && token) {
      fetch(`/admin-auth/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data) setUser(backendToUser(data));
        })
        .catch(() => {});
    }
    // eslint-disable-next-line
  }, []);

  // Inicializar mapa cuando llegamos al paso 4
  useEffect(() => {
    if (step === 4 && mapRef.current && !leafletMap.current) {
      // Capas base
      const calleLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "© OpenStreetMap contributors" }
      );
      const sateliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri" }
      );
      leafletMap.current = L.map(mapRef.current, {
        center: [
          user.address.coordinates.lat || 0,
          user.address.coordinates.lng || 0,
        ],
        zoom: 13,
        layers: [calleLayer],
      });
      L.control
        .layers(
          { Calles: calleLayer, Satélite: sateliteLayer },
          undefined,
          { position: "topright" }
        )
        .addTo(leafletMap.current);

      // Crear marcador inicial
      if (user.address.coordinates.lat && user.address.coordinates.lng) {
        markerRef.current = L.marker([
          user.address.coordinates.lat,
          user.address.coordinates.lng,
        ]).addTo(leafletMap.current);
      }

      // Evento de clic en el mapa
      leafletMap.current.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        setUser((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            coordinates: { lat, lng },
          },
        }));
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(leafletMap.current!);
        }
        await getAddressFromCoordinates(lat, lng);
      });

      // Control de búsqueda
      addSearchControl();
    }
    // eslint-disable-next-line
  }, [step]);

  // Actualizar marcador si cambian las coordenadas manualmente
  useEffect(() => {
    if (
      leafletMap.current &&
      user.address.coordinates.lat &&
      user.address.coordinates.lng
    ) {
      if (markerRef.current) {
        markerRef.current.setLatLng([
          user.address.coordinates.lat,
          user.address.coordinates.lng,
        ]);
      } else {
        markerRef.current = L.marker([
          user.address.coordinates.lat,
          user.address.coordinates.lng,
        ]).addTo(leafletMap.current);
      }
      leafletMap.current.setView(
        [user.address.coordinates.lat, user.address.coordinates.lng],
        15
      );
    }
    // eslint-disable-next-line
  }, [user.address.coordinates.lat, user.address.coordinates.lng]);

  // Control de búsqueda personalizado
  function addSearchControl() {
    if (!leafletMap.current) return;
    const SearchControl = L.Control.extend({
      options: { position: "topleft" },
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control"
        );
        container.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 4px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
            <input type="text" id="search-input" placeholder="Buscar ubicación..." 
                   style="width: 200px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
            <button type="button" id="search-btn" style="margin-left: 5px; padding: 5px 10px; background: var(--color-primary); color: white; border: none; border-radius: 3px; cursor: pointer;">
              Buscar
            </button>
          </div>
        `;
        const searchInput = container.querySelector(
          "#search-input"
        ) as HTMLInputElement;
        const searchBtn = container.querySelector(
          "#search-btn"
        ) as HTMLButtonElement;

        const performSearch = async (e: any) => {
          e.preventDefault();
          e.stopPropagation();
          const query = searchInput.value.trim();
          if (query) {
            await searchLocation(query);
          }
        };

        searchBtn.addEventListener("click", performSearch);
        searchInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            performSearch(e);
          }
        });

        return container;
      },
    });
    leafletMap.current.addControl(new SearchControl());
  }

  async function searchLocation(query: string) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`;
      const response = await fetch(
        `/admin-auth/nominatim?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setUser((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            coordinates: { lat, lng },
          },
        }));
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(leafletMap.current!);
        }
        leafletMap.current!.setView([lat, lng], 15);
        await getAddressFromCoordinates(lat, lng);
      }
    } catch (error) {
      console.error("Error buscando ubicación:", error);
    }
  }

  async function getAddressFromCoordinates(lat: number, lng: number) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await fetch(
        `/admin-auth/nominatim?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();
      if (data.address) {
        const address = data.address;
        setUser((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            address: [address.house_number, address.road, address.suburb]
              .filter(Boolean)
              .join(" "),
            city:
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              "",
            state: address.state || address.province || "",
            stateCode: address.state_code || "",
            postalCode: address.postcode || "",
            country: address.country || "",
            coordinates: { lat, lng },
          },
        }));
      }
    } catch (error) {
      console.error("Error obteniendo dirección:", error);
    }
  }

  // Validaciones
  function validateField(field: string) {
    switch (field) {
      case "firstName":
        if (!user.firstName || user.firstName.length < 2)
          return "El nombre es obligatorio y debe tener al menos 2 letras.";
        break;
      case "lastName":
        if (!user.lastName || user.lastName.length < 2)
          return "El apellido es obligatorio y debe tener al menos 2 letras.";
        break;
      case "maidenName":
        if (!user.maidenName || user.maidenName.length < 2)
          return "El segundo apellido es obligatorio y debe tener al menos 2 letras.";
        break;
      case "age":
        if (!user.age || Number(user.age) < 0 || Number(user.age) > 120)
          return "Edad inválida.";
        break;
      case "gender":
        if (!user.gender) return "Selecciona un género.";
        break;
      case "email":
        if (
          !user.email ||
          !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(user.email)
        )
          return "Correo electrónico inválido.";
        break;
      case "phone":
        if (!user.phone || user.phone.length < 7)
          return "Teléfono inválido.";
        break;
      case "username":
        if (!user.username || user.username.length < 3)
          return "El usuario debe tener al menos 3 caracteres.";
        break;
      case "password":
        if (user.password && user.password.length < 6)
          return "La contraseña debe tener al menos 6 caracteres.";
        break;
      case "birthDate":
        if (!user.birthDate) return "La fecha de nacimiento es obligatoria.";
        if (new Date(user.birthDate) > new Date())
          return "La fecha de nacimiento no puede ser en el futuro.";
        break;
      case "bloodGroup":
        if (!user.bloodGroup) return "Selecciona un grupo sanguíneo.";
        break;
      case "height":
        if (!user.height || Number(user.height) < 40 || Number(user.height) > 250)
          return "Altura inválida.";
        break;
      case "weight":
        if (!user.weight || Number(user.weight) < 2 || Number(user.weight) > 300)
          return "Peso inválido.";
        break;
      case "eyeColor":
        if (!user.eyeColor) return "Color de ojos obligatorio.";
        break;
      case "hair.color":
        if (!user.hair.color) return "Color de pelo obligatorio.";
        break;
      case "hair.type":
        if (!user.hair.type) return "Tipo de pelo obligatorio.";
        break;
      case "address.address":
        if (!user.address.address) return "Dirección obligatoria.";
        break;
      case "address.city":
        if (!user.address.city) return "Ciudad obligatoria.";
        break;
      case "address.state":
        if (!user.address.state) return "Estado obligatorio.";
        break;
      case "address.postalCode":
        if (!user.address.postalCode) return "Código postal obligatorio.";
        break;
      case "address.country":
        if (!user.address.country) return "País obligatorio.";
        break;
      case "address.coordinates.lat":
        if (
          user.address.coordinates.lat === null ||
          user.address.coordinates.lat === undefined
        )
          return "Latitud obligatoria.";
        break;
      case "address.coordinates.lng":
        if (
          user.address.coordinates.lng === null ||
          user.address.coordinates.lng === undefined
        )
          return "Longitud obligatoria.";
        break;
      default:
        return "";
    }
    return "";
  }

  function validateStep() {
    const fieldsByStep = [
      // Paso 1
      [
        "firstName",
        "lastName",
        "maidenName",
        "age",
        "gender",
        "email",
      ],
      // Paso 2
      [
        "phone",
        "username",
        "password",
        "birthDate",
        "bloodGroup",
        "height",
      ],
      // Paso 3
      [
        "weight",
        "eyeColor",
        "hair.color",
        "hair.type",
        "address.address",
        "address.city",
      ],
      // Paso 4
      [
        "address.state",
        "address.postalCode",
        "address.country",
        "address.coordinates.lat",
        "address.coordinates.lng",
        "macAddress",
      ],
      // Paso 5
      [
        "university",
        "bank.cardType",
        "bank.cardNumber",
        "bank.cardExpire",
        "bank.iban",
        "bank.currency",
      ],
      // Paso 6
      [
        "company.name",
        "company.department",
        "company.title",
        "company.address.address",
        "company.address.city",
        "company.address.state",
      ],
      // Paso 7
      [
        "company.address.postalCode",
        "company.address.country",
        "company.address.coordinates.lat",
        "company.address.coordinates.lng",
        "ein",
        "ssn",
      ],
      // Paso 8
      [
        "userAgent",
        "crypto.coin",
        "crypto.wallet",
        "crypto.network",
        "role",
        "disabled",
      ],
      // Paso 9
      [],
    ];
    const fields = fieldsByStep[step - 1];
    let valid = true;
    const newErrors: { [key: string]: string } = {};
    for (const field of fields) {
      let value: any = field;
      if (field.includes(".")) {
        value = field.split(".").reduce((o, k) => (o ? o[k] : undefined), user);
      } else {
        value = (user as any)[field];
      }
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  }

  const isStepValid = validateStep();

  function nextStep() {
    if (isStepValid && step < totalSteps) {
      setStep((s) => s + 1);
    }
  }
  function prevStep() {
    if (step > 1) setStep((s) => s - 1);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!isStepValid) return;
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (!id || !token) return;
    try {
      const payload = mapUserToBackend(user);
      const res = await fetch(`/admin-auth/user/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await Swal.fire({
          icon: "success",
          title: "Perfil guardado",
          text: "Tus datos han sido actualizados correctamente.",
        });
        window.location.reload();
      } else {
        const data = await res.json();
        await Swal.fire({
          icon: "error",
          title: "Error al guardar",
          text: data.error || "Error desconocido",
        });
      }
    } catch (e) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de red o servidor",
      });
    }
  }

  // Handlers para campos anidados
  function handleChange(
    path: string[],
    value: any
  ) {
    setUser((prev) => {
      const updated = { ...prev };
      let obj: any = updated;
      for (let i = 0; i < path.length - 1; i++) {
        obj[path[i]] = { ...obj[path[i]] };
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return updated;
    });
  }

  return (
    <div className="container">
      <h1 className="page-title">Mi Perfil</h1>
      <form onSubmit={saveProfile} className="profile-form">
        {/* Paso 1 */}
        {step === 1 && (
          <div className="form-step">
            <h2 className="step-title">Datos personales (1/3)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  value={user.firstName}
                  onChange={(e) =>
                    handleChange(["firstName"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input
                  value={user.lastName}
                  onChange={(e) =>
                    handleChange(["lastName"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Segundo Nombre</label>
                <input
                  value={user.maidenName}
                  onChange={(e) =>
                    handleChange(["maidenName"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.maidenName && (
                  <span className="error-message">{errors.maidenName}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Edad</label>
                <input
                  value={user.age}
                  type="number"
                  onChange={(e) =>
                    handleChange(["age"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.age && (
                  <span className="error-message">{errors.age}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Género</label>
                <div className="radio-group">
                  {genderOptions.map((opt) => (
                    <label key={opt.value} className="radio-option">
                      <input
                        type="radio"
                        checked={user.gender === opt.value}
                        onChange={() =>
                          handleChange(["gender"], opt.value)
                        }
                        className="radio-input"
                      />
                      <span className="radio-label">{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <span className="error-message">{errors.gender}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  value={user.email}
                  onChange={(e) =>
                    handleChange(["email"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="form-step">
            <h2 className="step-title">Datos personales (2/3)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input
                  value={user.phone}
                  onChange={(e) =>
                    handleChange(["phone"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Nombre de usuario</label>
                <input
                  value={user.username}
                  onChange={(e) =>
                    handleChange(["username"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  value={user.password}
                  type="text"
                  onChange={(e) =>
                    handleChange(["password"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de nacimiento</label>
                <input
                  value={user.birthDate}
                  type="date"
                  onChange={(e) =>
                    handleChange(["birthDate"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.birthDate && (
                  <span className="error-message">{errors.birthDate}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Grupo sanguíneo</label>
                <select
                  value={user.bloodGroup}
                  onChange={(e) =>
                    handleChange(["bloodGroup"], e.target.value)
                  }
                  className="form-select"
                >
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.bloodGroup && (
                  <span className="error-message">{errors.bloodGroup}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Altura</label>
                <input
                  value={user.height}
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    handleChange(["height"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.height && (
                  <span className="error-message">{errors.height}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <div className="form-step">
            <h2 className="step-title">Datos personales (3/3)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Peso (KG)</label>
                <input
                  value={user.weight}
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    handleChange(["weight"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.weight && (
                  <span className="error-message">{errors.weight}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Color de ojos</label>
                <input
                  value={user.eyeColor}
                  onChange={(e) =>
                    handleChange(["eyeColor"], e.target.value)
                  }
                  className="form-input"
                />
                {errors.eyeColor && (
                  <span className="error-message">{errors.eyeColor}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Pelo (color)</label>
                <input
                  value={user.hair.color}
                  onChange={(e) =>
                    handleChange(["hair", "color"], e.target.value)
                  }
                  className="form-input"
                />
                {errors["hair.color"] && (
                  <span className="error-message">{errors["hair.color"]}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Pelo (tipo)</label>
                <input
                  value={user.hair.type}
                  onChange={(e) =>
                    handleChange(["hair", "type"], e.target.value)
                  }
                  className="form-input"
                />
                {errors["hair.type"] && (
                  <span className="error-message">{errors["hair.type"]}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input
                  value={user.address.address}
                  onChange={(e) =>
                    handleChange(["address", "address"], e.target.value)
                  }
                  className="form-input"
                />
                {errors["address.address"] && (
                  <span className="error-message">
                    {errors["address.address"]}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input
                  value={user.address.city}
                  onChange={(e) =>
                    handleChange(["address", "city"], e.target.value)
                  }
                  className="form-input"
                />
                {errors["address.city"] && (
                  <span className="error-message">
                    {errors["address.city"]}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Paso 4: Mapa */}
        {step === 4 && (
          <div className="map-step">
            <h2 className="step-title">Ubicación</h2>
            <div className="map-container">
              <div id="map" className="map" ref={mapRef}></div>
              <div className="map-actions">
                <button
                  type="button"
                  className="info-btn"
                  onClick={() => setShowModal(true)}
                >
                  Ver información de ubicación
                </button>
              </div>
            </div>
            {/* Modal */}
            {showModal && (
              <div
                className="modal-overlay"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowModal(false);
                }}
              >
                <div className="modal-content">
                  <h2 className="modal-title">Información de ubicación</h2>
                  <div className="modal-grid">
                    <div className="info-group">
                      <label className="info-label">Latitud</label>
                      <div className="readonly-field">
                        {user.address.coordinates.lat || "No seleccionada"}
                      </div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Longitud</label>
                      <div className="readonly-field">
                        {user.address.coordinates.lng || "No seleccionada"}
                      </div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Dirección MAC</label>
                      <input
                        value={user.macAddress}
                        onChange={(e) =>
                          handleChange(["macAddress"], e.target.value)
                        }
                        placeholder="Ej: 47:fa:41:18:ec:eb"
                        className="form-input"
                      />
                    </div>
                    <div className="info-group">
                      <label className="info-label">Dirección</label>
                      <input
                        value={user.address.address}
                        onChange={(e) =>
                          handleChange(["address", "address"], e.target.value)
                        }
                        className="form-input"
                        placeholder="Dirección manual o seleccionada"
                      />
                    </div>
                    <div className="info-group">
                      <label className="info-label">Ciudad</label>
                      <div className="readonly-field">
                        {user.address.city || "No seleccionada"}
                      </div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Estado</label>
                      <div className="readonly-field">
                        {user.address.state || "No seleccionado"}
                      </div>
                    </div>
                    <div className="info-group">
                      <label className="info-label">Código postal</label>
                      <input
                        value={user.address.postalCode}
                        onChange={(e) =>
                          handleChange(
                            ["address", "postalCode"],
                            e.target.value
                          )
                        }
                        className="form-input"
                        placeholder="Código postal manual o seleccionado"
                      />
                    </div>
                    <div className="info-group">
                      <label className="info-label">País</label>
                      <div className="readonly-field">
                        {user.address.country || "No seleccionado"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Paso 5 */}
        {step === 5 && (
          <div className="form-step">
            <h2 className="step-title">Profesional y bancaria (1/3)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Universidad</label>
                <input
                  value={user.university}
                  onChange={(e) =>
                    handleChange(["university"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de banco</label>
                <input
                  value={user.bank.cardType}
                  onChange={(e) =>
                    handleChange(["bank", "cardType"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Número de banco</label>
                <input
                  value={user.bank.cardNumber}
                  onChange={(e) =>
                    handleChange(["bank", "cardNumber"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expiración del banco</label>
                <input
                  value={user.bank.cardExpire}
                  onChange={(e) =>
                    handleChange(["bank", "cardExpire"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Banco (IBAN)</label>
                <input
                  value={user.bank.iban}
                  onChange={(e) =>
                    handleChange(["bank", "iban"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Moneda del banco</label>
                <input
                  value={user.bank.currency}
                  onChange={(e) =>
                    handleChange(["bank", "currency"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 6 */}
        {step === 6 && (
          <div className="form-step">
            <h2 className="step-title">Profesional y bancaria (2/3)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Compañía</label>
                <input
                  value={user.company.name}
                  onChange={(e) =>
                    handleChange(["company", "name"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Departamento</label>
                <input
                  value={user.company.department}
                  onChange={(e) =>
                    handleChange(["company", "department"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Título</label>
                <input
                  value={user.company.title}
                  onChange={(e) =>
                    handleChange(["company", "title"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Dirección Compañía</label>
                <input
                  value={user.company.address.address}
                  onChange={(e) =>
                    handleChange(
                      ["company", "address", "address"],
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad Compañía</label>
                <input
                  value={user.company.address.city}
                  onChange={(e) =>
                    handleChange(
                      ["company", "address", "city"],
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Estado Compañía</label>
                <input
                  value={user.company.address.state}
                  onChange={(e) =>
                    handleChange(
                      ["company", "address", "state"],
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 7 */}
        {step === 7 && (
          <div className="form-step">
            <h2 className="step-title">Profesional y bancaria (3/3)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Código Postal Compañía</label>
                <input
                  value={user.company.address.postalCode}
                  onChange={(e) =>
                    handleChange(
                      ["company", "address", "postalCode"],
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">País Compañía</label>
                <input
                  value={user.company.address.country}
                  onChange={(e) =>
                    handleChange(
                      ["company", "address", "country"],
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Latitud Compañía</label>
                <input
                  value={user.company.address.coordinates.lat}
                  type="number"
                  step="0.00001"
                  onChange={(e) =>
                    handleChange(
                      ["company", "address", "coordinates", "lat"],
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitud Compañía</label>
                <input
                  value={user.company.address.coordinates.lng}
                  type="number"
                  step="0.00001"
                  onChange={(e) =>
                    handleChange(
                      ["company", "address", "coordinates", "lng"],
                      e.target.value
                    )
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">EIN</label>
                <input
                  value={user.ein}
                  onChange={(e) =>
                    handleChange(["ein"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">SSN</label>
                <input
                  value={user.ssn}
                  onChange={(e) =>
                    handleChange(["ssn"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Paso 8 */}
        {step === 8 && (
          <div className="form-step">
            <h2 className="step-title">Seguridad y otros datos (1/2)</h2>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">User Agent</label>
                <input
                  value={user.userAgent}
                  onChange={(e) =>
                    handleChange(["userAgent"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cripto (moneda)</label>
                <input
                  value={user.crypto.coin}
                  onChange={(e) =>
                    handleChange(["crypto", "coin"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cripto (wallet)</label>
                <input
                  value={user.crypto.wallet}
                  onChange={(e) =>
                    handleChange(["crypto", "wallet"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cripto (network)</label>
                <input
                  value={user.crypto.network}
                  onChange={(e) =>
                    handleChange(["crypto", "network"], e.target.value)
                  }
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rol</label>
                <input
                  value={user.type}
                  className="form-input"
                  readOnly
                />
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={user.status === "inactive"}
                    disabled
                    readOnly
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Deshabilitado</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Paso 9 */}
        {step === 9 && (
          <div className="confirmation-step">
            <h2 className="step-title">Confirmar y guardar</h2>
            <p className="confirmation-text">
              Revisa tus datos y haz clic en Guardar para finalizar.
            </p>
          </div>
        )}

        <div className="wizard-nav">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className="nav-btn nav-btn-secondary"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={step === totalSteps || !isStepValid}
            className="nav-btn nav-btn-primary"
          >
            Siguiente
          </button>
          {step === totalSteps && (
            <button
              type="submit"
              disabled={!isStepValid}
              className="nav-btn nav-btn-success"
            >
              Guardar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Perfil;