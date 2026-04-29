import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Homepage } from './pages/homepage';
import { HealthEvents } from './pages/healthevents';
import { ref, onValue, getDatabase} from "firebase/database"
import {ProviderLoginPage} from "./pages/providerlogin"
import { EditClinic } from "./providerview/editclinic";
import { AddEvent } from "./providerview/addevent";

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Homepage/>} />
      <Route path="healthevents" element={<HealthEvents/>} />
      <Route path="providerlogin" element={<ProviderLoginPage/>} />
      <Route path="editclinic" element={<EditClinic />} />
      <Route path="addevent" element={<AddEvent />} />
      {/* </Routes><Route path="healthevents" element={<health>} /> */}
    </Routes>
  )
}
