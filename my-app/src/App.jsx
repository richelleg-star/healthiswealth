import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router';
import { Homepage } from './pages/homepage';
import { HealthEvents } from './pages/healthevents';
import { ref, onValue, getDatabase} from "firebase/database"
import {ProviderLoginPage} from "./pages/providerlogin"

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Homepage/>} />
      <Route path="healthevents" element={<HealthEvents/>} />
      <Route path="providerlogin" element={<ProviderLoginPage/>} />
      {/* </Routes><Route path="healthevents" element={<health>} /> */}
    </Routes>
  )
}
