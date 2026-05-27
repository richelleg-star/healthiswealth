import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Homepage } from './pages/homepage';
import { HealthEvents } from './pages/healthevents';
import { ref, onValue, getDatabase} from "firebase/database"
import {ProviderLoginPage} from "./pages/providerlogin"
import { ProviderSignupPage } from './pages/providersignup';
import { EditClinic } from "./providerview/editclinic";
import { AddEvent } from "./providerview/addevent";
import { DeleteEventPage } from './providerview/deleteevent';

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Homepage/>} />
      <Route path="healthevents" element={<HealthEvents/>} />
      <Route path="providerlogin" element={<ProviderLoginPage/>} />
      <Route path='provider-signup' element={<ProviderSignupPage/>}/>
      <Route path="editclinic" element={<EditClinic />} />
      <Route path="addevent" element={<AddEvent />} />
      <Route path="deletevent" element={<DeleteEventPage/>} />
      {/* </Routes><Route path="healthevents" element={<health>} /> */}
    </Routes>
  )
}
