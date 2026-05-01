import { useState } from "react";

export function CalendarIntegration(props) {
  const [open, setOpen] = useState(false); // this prop is used for the dropdown button in react

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

  return (
    <div className="dropdown">
      <button className="btn btn-outline" onClick={() => setOpen(!open)}>
        Add to Calendar
      </button>

      {open && ( // if the overlay was open
        <ul className="dropdown-menu">
            {calendars.map(({ label, url, target, download }) => (
            <li key={label} className="dropdown-item">
                <button className="btn btn-outline"
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
        </ul>
      )}
    </div>
  );
}