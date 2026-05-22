import { getDatabase, ref, query, orderByChild, equalTo, get, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";

export function DeleteEventPage(props) {
  const [events, setEvents] = useState([]);
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const eventsRef = ref(db, "healthevents");
      const q = query(eventsRef, orderByChild("uid"), equalTo(user.uid));
      const snapshot = await get(q);

      if (snapshot.exists()) {
        const userEvents = [];
        snapshot.forEach((child) => {
          userEvents.push({ id: child.key, ...child.val() });
        });
        setEvents(userEvents);
      } else {
        console.log("No events found for this user");
      }
    };

    fetchEvents();
  }, []);


    const deleteClinicEvent = async (eventId) => {
        const db = getDatabase();
        await remove(ref(db, `healthevents/${eventId}`));
        
        // Remove it from local state too so the UI updates instantly
        setEvents(events.filter(e => e.id !== eventId));
    };


  return (
    <>
    <div>navbar</div>
    <div>
      {events.map(event => (
        <div key={event.id}>
            {event.Name}
            <button onClick={() => deleteClinicEvent(event.id)}>delete</button>
        </div>
      ))}
    </div>
    </>
  );
}