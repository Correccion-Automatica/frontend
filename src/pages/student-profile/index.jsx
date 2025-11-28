import React, { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useAuth } from "../../context/AuthProvider";
import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, FaBook, FaUsers, FaCalendarAlt, FaInbox, 
  FaQuestionCircle
} from "react-icons/fa";

export default function StudentProfile() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // 🔹 Obtener cursos del estudiante
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get("/courses/user/all");

        const normalized = res.data.map((item) => ({
          id: item.course.id,
          name: item.course.name,
          acronym: item.course.acronym,
          period: item.course.period,
          professorId: item.teacher,
        }));

        setCourses(normalized);
      } catch (error) {
        console.error("Error cursos alumno:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [authLoading, isAuthenticated]);

  const studentName = user?.fullName || user?.name || "Alumno/a";
  const studentEmail = user?.email || "";

  // Sidebar links (mismos que teacher, pero no muestran create ni settings)
  const navLinks = [
    { to: "/dashboard", label: "Tablero", icon: <FaHome /> },
    { to: "/student-profile", label: "Cursos", icon: <FaBook /> },
    { to: "/groups", label: "Grupos", icon: <FaUsers /> },
    { to: "/calendar", label: "Calendario", icon: <FaCalendarAlt /> },
    { to: "/inbox", label: "Bandeja de entrada", icon: <FaInbox /> },
    { to: "/support", label: "Ayuda y soporte", icon: <FaQuestionCircle /> },
  ];

  return (
    <div className="min-h-screen w-full flex flex-row bg-white dark:bg-black">

      {/* SIDEBAR (idéntico al del profe) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-black shadow-lg border-r border-gray-200 dark:border-gray-800 min-h-screen px-6 py-8">
        
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold mb-2 overflow-hidden shadow">
            {user?.photoUrl ? (
              <img src={user.photoUrl} className="w-full h-full object-cover" />
            ) : (
              studentName[0]
            )}
          </div>
          <div className="font-semibold text-base text-center leading-tight mt-2">
            {studentName}
          </div>
          <div className="text-xs text-gray-500">{studentEmail}</div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-4 mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50 text-gray-700 font-medium
              ${location.pathname === link.to ? "bg-blue-100 text-blue-700" : ""}`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ----------- MAIN CONTENT (idéntico a Teacher) ------------ */}
      <main className="flex-1 py-10 px-4 md:px-12 bg-white dark:bg-black">

        {/* Header (sin botón "nuevo curso") */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Cursos inscritos
          </h1>

          {/* En móvil: avatar y nombre */}
          <div className="flex sm:hidden items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg font-bold overflow-hidden shadow">
              {user?.photoUrl ? (
                <img src={user.photoUrl} className="w-full h-full object-cover" />
              ) : (
                studentName[0]
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800 dark:text-white">{studentName}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{studentEmail}</span>
            </div>
          </div>

        </div>

        {/* GRID DE CURSOS (igual al TeacherProfile pero sin "0 estudiantes") */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mx-auto px-2 md:px-0">

          {loading ? (
            <div className="col-span-full text-center text-gray-400 dark:text-gray-500 animate-pulse">
              Cargando cursos...
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6
                           flex flex-col justify-between transition-all border
                           border-gray-100 dark:border-gray-700 hover:bg-gray-100
                           dark:hover:bg-gray-800 hover:shadow-lg"
              >
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {course.name}
                  </h2>

                  <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                    {course.acronym} {course.period}
                  </div>

                  <div className="text-xs text-gray-400 dark:text-gray-400">
                    Profesor ID: {course.professorId}
                  </div>
                </div>

                <Link
                  to={`/student-profile/course-view/${course.id}`}
                  state={{
                    courseName: course.name,
                    courseCode: course.acronym,
                    coursePeriod: course.period,
                    professorId: course.professorId,
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Ver detalles
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 dark:text-gray-500">
              No estás inscrito en ningún curso.
            </div>
          )}
        </div>
      </main>

      {/* NAVBAR BOTTOM (igual al teacher pero sin create) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex justify-between items-center px-2 py-1 shadow-lg md:hidden z-40">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.to}
            className="flex flex-col items-center justify-center text-xs text-gray-700 dark:text-gray-300 w-1/6"
          >
            <span className="text-lg mb-1">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

    </div>
  );
}
