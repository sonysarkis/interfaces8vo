import React, { useState } from 'react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number | '';
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  disabled: boolean;
}

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User>({
    id: 1,
    firstName: '',
    lastName: '',
    maidenName: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    username: '',
    birthDate: '',
    image: '',
    disabled: false
  });

  // Aquí irá la lógica avanzada: pasos, validaciones, mapa, etc.

  return (
    <div className="container">
      <h1 className="page-title">Perfil de Usuario</h1>
      <div className="user-detail">
        <div className="user-header">
          <img src={user.image} alt="Foto de usuario" className="user-image" />
          <div className="user-basic-info">
            <input
              name="firstName"
              value={user.firstName}
              onChange={e => setUser({ ...user, firstName: e.target.value })}
              className="user-name-input"
              placeholder="Nombre"
            />
            <input
              name="lastName"
              value={user.lastName}
              onChange={e => setUser({ ...user, lastName: e.target.value })}
              className="user-name-input"
              placeholder="Apellido"
            />
            <input
              name="email"
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
              className="user-email-input"
              placeholder="Email"
            />
          </div>
        </div>
        {/* Aquí irán más campos y lógica avanzada (mapa, pasos, etc.) */}
      </div>
    </div>
  );
};

export default UserProfile; 