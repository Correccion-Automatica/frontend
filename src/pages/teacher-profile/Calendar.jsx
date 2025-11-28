import React, { useState } from "react";
import CalendarComponent from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const views = ["Mensual", "Semanal", "Anual"];

const demoEvents = [
  { title: 'Product Design Course', start: '2025-11-11T09:30:00', end: '2025-11-11T12:00:00', color: '#34d399' },
  { title: 'Conversational Interview', start: '2025-11-11T12:30:00', end: '2025-11-11T14:00:00', color: '#818cf8' },
  { title: 'Usability testing', start: '2025-11-13T09:00:00', end: '2025-11-13T11:00:00', color: '#a78bfa' },
  { title: 'Frontend development', start: '2025-11-14T10:00:00', end: '2025-11-14T13:00:00', color: '#60a5fa' },
  { title: 'App Design', start: '2025-11-11T13:00:00', end: '2025-11-11T15:30:00', color: '#6ee7b7' },
];

export default function Calendar() {
  const [selectedView, setSelectedView] = useState("Mensual");
  const [date, setDate] = useState(new Date());
  return (
    <div className="p-4 md:p-8 flex flex-col items-center min-h-screen bg-white dark:bg-black">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-white">Calendario</h2>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 w-full max-w-5xl">
        <div className="mb-4 flex gap-2 justify-center">
          {views.map(view => (
            <button
              key={view}
              className={`px-4 py-2 rounded-lg font-medium border transition-colors duration-200 ${selectedView === view ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
              onClick={() => setSelectedView(view)}
            >
              {view}
            </button>
          ))}
        </div>
        <div className="text-gray-700 dark:text-gray-200 text-center">
          <p>Vista seleccionada: <span className="font-semibold">{selectedView}</span></p>
          <div className="mt-4 flex justify-center">
            {selectedView === "Mensual" && (
              <CalendarComponent
                value={date}
                onChange={setDate}
                className="rounded-lg shadow"
              />
            )}
            {selectedView === "Semanal" && (
              <div className="w-full">
                <FullCalendar
                  plugins={[timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{ left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' }}
                  events={demoEvents}
                  height={600}
                  slotMinTime="08:00:00"
                  slotMaxTime="20:00:00"
                  nowIndicator={true}
                  editable={true}
                  selectable={true}
                />
              </div>
            )}
            {selectedView === "Anual" && (
              <div className="h-32 flex items-center justify-center bg-blue-50 dark:bg-blue-900 rounded">Ejemplo de vista anual</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
