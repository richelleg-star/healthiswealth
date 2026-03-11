import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Homepage } from './pages/homepage';
import { HealthEvents } from './pages/healthevents'
import { ProviderLogin } from './pages/providerlogin'
import { ref, onValue, getDatabase} from "firebase/database"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" replace />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/healthevents" element={<HealthEvents />} />
      <Route path="/providerlogin" element={<ProviderLogin />} />
      <Route path="*" element={<Navigate to="/homepage" replace />} />
    </Routes>
  )
}
