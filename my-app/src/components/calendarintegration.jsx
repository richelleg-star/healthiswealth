import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function CalendarIntegration(props) {
  const [open, setOpen] = useState(false); // this prop is used for the dropdown button in react
  const [menuStyle, setMenuStyle] = useState({});
  const buttonRef = useRef(null);

  // convert our dates so they are properly formatted
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // add one to prevent any day late errors
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toGoogleDate = (dateStr) => dateStr.replace(/-/g, "");

  const eventName = props.name;
  const startDate = formatDate(props.startDate);
  const endDate = formatDate(props.endDate);
  const location = props.location || "";
  const description = props.description || "";

  // lines 26-43 were help generated with ClaudeAI to get link formatting right for the props we have 

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${toGoogleDate(startDate)}/${toGoogleDate(endDate)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`;

  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${eventName}\nDTSTART:${toGoogleDate(startDate)}\nDTEND:${toGoogleDate(endDate)}\nLOCATION:${location}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
  const icsUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventName)}&startdt=${startDate}&enddt=${endDate}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}`;

  const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(eventName)}&st=${toGoogleDate(startDate)}&et=${toGoogleDate(endDate)}&in_loc=${encodeURIComponent(location)}&desc=${encodeURIComponent(description)}`;

  const microsoft365Url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventName)}&startdt=${startDate}&enddt=${endDate}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}`;

  const calendars = [
    { label: "Google Calendar", url: googleUrl, target: "_blank" },
    { label: "Apple / iCal", url: icsUrl, download: "event.ics" },
    { label: "Outlook", url: outlookUrl, target: "_blank" },
    { label: "Microsoft 365", url: microsoft365Url, target: "_blank" },
    { label: "Yahoo Calendar", url: yahooUrl, target: "_blank" },
  ];

  // Position the portal menu below the button on desktop; CSS handles mobile bottom sheet
  const handleOpen = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        // On mobile, let CSS handle it as a bottom sheet and don't set fixed positioning
        setMenuStyle({});
      } else {
        // On desktop, anchor the menu below the button
        setMenuStyle({
          position: "fixed",
          top: rect.bottom + 8,
          left: rect.left,
          zIndex: 9999,
        });
      }
    }
    setOpen(!open);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (buttonRef.current && !buttonRef.current.closest(".dropdown").contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="dropdown">
      <button ref={buttonRef} className="btn btn-outline" onClick={handleOpen}>
        Add to Calendar
      </button>

      {open && createPortal( 
        <ul className="dropdown-menu" style={menuStyle}>
          {calendars.map(({ label, url, target, download }) => (
            <li key={label} className="dropdown-item">
              <button
                className="btn btn-outline"
                onClick={() => {
                  if (download) {
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = download;
                    link.click();
                  } else {
                    window.open(url, target);
                  }
                  setOpen(false);
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  );
}