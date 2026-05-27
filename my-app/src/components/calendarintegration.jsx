import { useState, useRef } from "react";
import { createPortal } from "react-dom";

export function CalendarIntegration(props) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const buttonRef = useRef(null);

  const hasTime = (dateStr) => dateStr && dateStr.includes("T");

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date)) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // formatDateTime generated with the help of Claude for being able to format dates when they are all day vs have specific time
  const formatDateTime = (dateStr) => {
    if (!dateStr || !hasTime(dateStr)) return null;
    const date = new Date(dateStr);
    if (isNaN(date)) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${mins}00`;
  };

  const eventName = props.name;
  const location = props.location || "";
  const description = props.description || "";

  const startDate = formatDate(props.startDate);
  const endDate = formatDate(props.endDate);
  const startDateTime = formatDateTime(props.startDate);
  const endDateTime = formatDateTime(props.endDate);

  if (!startDate || !endDate) {
    return (
      <button className="btn btn-outline" disabled>
        Add to Calendar
      </button>
    );
  }


  // urls for the ics help generated with claude
  const googleStart = startDateTime ?? startDate.replace(/-/g, "");
  const googleEnd = endDateTime ?? endDate.replace(/-/g, "");

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${googleStart}/${googleEnd}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`;

  const icsStart = startDateTime
    ? `DTSTART:${startDateTime}`
    : `DTSTART;VALUE=DATE:${startDate.replace(/-/g, "")}`;
  const icsEnd = endDateTime
    ? `DTEND:${endDateTime}`
    : `DTEND;VALUE=DATE:${endDate.replace(/-/g, "")}`;

  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${eventName}\n${icsStart}\n${icsEnd}\nLOCATION:${location}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
  const icsUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  const outlookStart = startDateTime
    ? `${formatDate(props.startDate)}T${props.startDate.split("T")[1]}:00`
    : startDate;
  const outlookEnd = endDateTime
    ? `${formatDate(props.endDate)}T${props.endDate.split("T")[1]}:00`
    : endDate;

  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventName)}&startdt=${outlookStart}&enddt=${outlookEnd}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}`;

  const microsoft365Url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventName)}&startdt=${outlookStart}&enddt=${outlookEnd}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}`;

  const yahooUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(eventName)}&st=${googleStart}&et=${googleEnd}&in_loc=${encodeURIComponent(location)}&desc=${encodeURIComponent(description)}`;

  const calendars = [
    { label: "Google Calendar", url: googleUrl, target: "_blank" },
    { label: "Apple / iCal", url: icsUrl, download: "event.ics" },
    { label: "Outlook", url: outlookUrl, target: "_blank" },
    { label: "Microsoft 365", url: microsoft365Url, target: "_blank" },
    { label: "Yahoo Calendar", url: yahooUrl, target: "_blank" },
  ];

  const handleOpen = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuStyle({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
    setOpen(!open);
  };

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