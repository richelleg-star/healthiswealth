import { useEffect, useState } from 'react'
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Homepage } from './pages/homepage';
import { HealthEvents } from './pages/healthevents';
import { ref, onValue, getDatabase} from "firebase/database"
import {ProviderLoginPage} from "./pages/providerlogin"
import { EditClinic } from "./providerview/editclinic";
import { AddEvent } from "./providerview/addevent";

export default function App() {
  
  const [heroTitle, setHeroTitle] = useState("Find Affordable Care, Instantly.");

  const handleTranslate = async (e) => {
      const targetLang = e.target.value;
      
      // Reset to English if they select it
      if (targetLang === 'en') {
          setHeroTitle("Find Affordable Care, Instantly.");
          return;
      }

      try {
          // Ping backend server
          const response = await fetch("http://localhost:5000/api/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  text: "Find Affordable Care, Instantly.", 
                  target: targetLang
              })
          });

          const data = await response.json();
          
          if (data.translatedText) {
              // Update the state with the translated text
              setHeroTitle(data.translatedText);
          }
      } catch (error) {
          console.error("Could not reach backend:", error);
      }
  };

  return (
    // Wrap everything in a main div so we can put a header above the routes
    <div>
      
      <header className="global-header" style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #ccc' }}>
          <select onChange={handleTranslate} aria-label="Select Language">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="vi">Tiếng Việt</option>
          </select>
      </header>

      {/*Page Routes */}
      <Routes>
        <Route path="*" element={<Homepage heroTitle={heroTitle} />} />
        <Route path="healthevents" element={<HealthEvents />} />
        <Route path="providerlogin" element={<ProviderLoginPage />} />
        <Route path="editclinic" element={<EditClinic />} />
        <Route path="addevent" element={<AddEvent />} />
      </Routes>

    </div>
  )
}
