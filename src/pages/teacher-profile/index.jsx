import React, { useEffect, useState } from "react";
import CardGrid from "../../components/CardGridCourses";
import { api } from "../../lib/axios";
import { useAuth } from "../../context/AuthProvider";
import { useCredits } from "../../context/CreditsContext";
import { Link, useLocation } from "react-router-dom";
import { FaBook, FaUsers, FaInbox, FaUserPlus } from "react-icons/fa";
import { FaFolderOpen, FaCog, FaQuestionCircle, FaUserAlt, FaSignOutAlt } from "react-icons/fa";

export default function TeacherProfile() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const { credits: ctxCredits, loading: _creditsLoading, refreshCredits } = useCredits();

  // Sincronizar créditos al entrar a la vista de teacher
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      refreshCredits();
    }
  }, [isAuthenticated, authLoading, refreshCredits]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await api.get("/courses/user/all");
        const normalized = response.data.map((item) => ({
          id: item.course.id,
          name: item.course.name,
          acronym: item.course.acronym,
          period: item.course.period,
          numStudents: item.course.numStudents || 0,
        }));
        setCourses(normalized);
      } catch (error) {
        console.error("Error al obtener cursos del profesor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [authLoading, isAuthenticated]);

  const teacherName = user?.fullName || user?.name || "Profesor/a";
  const teacherEmail = user?.email || "";

  const creditsFromUser = Number(user?.remaining_credits ?? user?.credits ?? 0);
  const credits = Number(ctxCredits ?? creditsFromUser ?? 0);


  const navLinks = [
    { to: "/teacher-profile", label: "Cursos", icon: <FaBook /> },
    { to: "/groups", label: "Grupos", icon: <FaUsers /> },
    { to: "/inbox", label: "Bandeja de entrada", icon: <FaInbox /> },
    { to: "/support", label: "Ayuda y soporte", icon: <FaQuestionCircle /> },
  ];

  const CreditsCard = ({ className = "", variant = "elevated" }) => {
    const baseClasses =
      variant === "embedded"
        ? "bg-transparent border-none p-0 shadow-none space-y-2"
        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-2";

    return (
      <div className={`${baseClasses} ${className}`.trim()}>
        <div className="text-sm text-gray-500">Créditos disponibles</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {credits.toLocaleString()} créditos
        </div>
        <div className="text-xs text-gray-400 mt-1">{teacherName}</div>

        <Link
          to="/payments/history"
          className="inline-flex items-center justify-center px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Ver historial
        </Link>

        <Link
          to="/payments/purchase"
          className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm w-full"
        >
          Comprar créditos
        </Link>

      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-row bg-white dark:bg-black">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-black shadow-lg border-r border-gray-200 dark:border-gray-800 min-h-screen px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold mb-2 overflow-hidden shadow">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              user?.fullName ? user.fullName[0] : "U"
            )}
          </div>
          <div className="font-semibold text-base text-center leading-tight mt-2">{teacherName}</div>
          <div className="text-xs text-gray-500">{teacherEmail}</div>
        </div>

        <CreditsCard />

        <nav className="flex flex-col gap-4 mt-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50 text-gray-700 font-medium ${
                location.pathname === link.to ? "bg-blue-100 text-blue-700" : ""
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 py-10 px-4 md:px-12 bg-white dark:bg-black">
        <div className="hidden md:flex items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cursos inscritos</h1>
          <Link to="/teacher-profile/create-course">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-all">
              Nuevo curso
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
          {loading ? (
            <div className="col-span-full text-center text-gray-400">Cargando cursos...</div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 flex flex-col justify-between border border-gray-100 dark:border-gray-700 overflow-hidden group"
              >
                {/* Botón invitación: icono en esquina superior derecha con transición */}
                <Link
                  to={`/teacher-profile/course-view/${course.id}/add-users`}
                  state={{
                    courseName: course.name,
                    courseCode: course.acronym,
                    coursePeriod: course.period,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-3 right-3 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:bg-blue-200 dark:hover:bg-blue-800/60 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  title="Invitar estudiantes"
                >
                  <FaUserPlus className="text-lg" aria-hidden />
                </Link>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 pr-10">
                    {course.name}
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                    {course.acronym} {course.period}
                  </div>
                  <div className="text-xs text-gray-400">
                    {course.numStudents} estudiantes
                  </div>
                </div>

                <Link
                  to={`/teacher-profile/course-view/${course.id}`}
                  state={{
                    courseName: course.name,
                    courseCode: course.acronym,
                    coursePeriod: course.period,
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium inline-block"
                >
                  Ver detalles
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              No tienes cursos asignados.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}