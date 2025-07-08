import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LandingPage = lazy(() => import('../views/LandingPage'));
const Login = lazy(() => import('../views/Login'));
const Register = lazy(() => import('../views/Register'));
const Personalization = lazy(() => import('../views/Personalization'));
const UserList = lazy(() => import('../views/UserList'));
const UserDetail = lazy(() => import('../views/UserDetail'));
const UserProfile = lazy(() => import('../views/UserProfile'));

const RoutesList: React.FC = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Register />} />
    <Route path="/personalization/*" element={<Personalization />} />
    <Route path="/usuarios" element={<UserList />} />
    <Route path="/usuarios/:id" element={<UserDetail />} />
    <Route path="/perfil" element={<UserProfile />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default RoutesList; 