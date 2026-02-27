import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router';
import { Homepage } from './pages/homepage';
import { ref, onValue, getDatabase} from "firebase/database"

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<Homepage/>} />
      {/* </Routes><Route path="healthevents" element={<health>} /> */}
    </Routes>
  )
}
