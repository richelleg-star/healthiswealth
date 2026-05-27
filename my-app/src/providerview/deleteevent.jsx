import { getDatabase, ref, query, orderByChild, equalTo, get, remove } from "firebase/database";
import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { ProviderBar } from "../navbar/providerbar";
import { FooterForWeb } from "../navbar/footer";
import { DeleteCards } from "../cards/deletecards";
import { ViewMap } from "../components/mapintegration";

export function DeleteEventPage(props) {
  const [events, setEvents] = useState([]);
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

    console.log(events)


  return (
    <>
    <ProviderBar/>
                <div>
                    <div className="list-view">
                                                {events.map((event) => (
                                                    <DeleteCards key={event.id} allevents={event} />
                                                ))}
                    </div>
                </div>
        <FooterForWeb/>
    </>
  );
}