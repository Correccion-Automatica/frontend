import React, { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { useAuth } from "../../context/AuthProvider";
import { useCredits } from "../../context/CreditsContext";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook } from "react-icons/fa";
import { FaQuestionCircle, FaPlus, FaUser } from "react-icons/fa";

export default function TeacherProfile() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    { to: "/dashboard", label: "Tablero", icon: <FaHome /> },
    { to: "/teacher-profile", label: "Cursos", icon: <FaBook /> },
    { to: "/support", label: "Ayuda y soporte", icon: <FaQuestionCircle /> },
  ];

  const CreditsCard = ({ className = "", variant = "elevated" }) => {
    const baseClasses =
      variant === "embedded"
        ? "bg-transparent border-none p-0 shadow-none space-y-2"
        : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-2";

    return (
      <div className={`${baseClasses} ${className}`.trim()}>
        <div className="text-sm text-gray-500">Créditos</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
          {credits.toLocaleString()} créditos
        </div>
        <div className="text-xs text-gray-400 mt-1">{teacherName}</div>
        <Link
          to="/payments/history"
          className="inline-flex items-center justify-center px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Ver detalle
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
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-blue-50 text-gray-700 font-medium ${location.pathname === link.to ? "bg-blue-100 text-blue-700" : ""}`}
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 py-10 px-4 md:px-12 bg-white dark:bg-black transition-colors duration-300">
        <section className="md:hidden mb-8 space-y-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg font-bold overflow-hidden shadow">
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  user?.fullName ? user.fullName[0] : "U"
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base text-gray-800 dark:text-white">{teacherName}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{teacherEmail}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <CreditsCard variant="embedded" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cursos inscritos</h1>
            <Link to="/teacher-profile/create-course" className="w-full">
              <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white dark:text-gray-100 font-semibold py-2 px-4 rounded-lg shadow-md transition-all text-base flex items-center gap-2 w-full justify-center">
                <span className="text-lg" style={{ color: "inherit" }}>
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Nuevo curso</span>
              </button>
            </Link>
          </div>
        </section>


        <div className="hidden md:flex items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cursos inscritos</h1>
          <Link to="/teacher-profile/create-course" className="w-full md:w-auto">
            <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 text-white dark:text-gray-100 font-semibold py-2 px-5 rounded-lg shadow-md transition-all text-base flex items-center gap-2 w-full md:w-auto justify-center min-w-[160px]">
              <span className="text-lg" style={{ color: "inherit" }}>
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <span>Nuevo curso</span>
            </button>
          </Link>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mx-auto px-2 md:px-0">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 dark:text-gray-500 animate-pulse">Cargando cursos...</div>
          ) : courses.length > 0 ? (
            courses.map(course => (
              <Link
                key={course.id}
                to={`/teacher-profile/course-view/${course.id}`}
                state={{
                  courseName: course.name,
                  courseCode: course.acronym,
                  coursePeriod: course.period,
                }}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-6 flex flex-col justify-between transition-all cursor-pointer border border-gray-100 dark:border-gray-700 w-full hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-lg relative group"
              >
                {/* Contenedor del botón con tooltip */}
                <div className="absolute top-3 right-3 z-10 group/btn">
                  {/* Botón + para agregar estudiantes - siempre visible */}
                  <Link
                    to={`/teacher-profile/course-view/${course.id}/add-users`}
                    onClick={(e) => e.stopPropagation()}
                    state={{
                      courseName: course.name,
                      courseCode: course.acronym,
                      coursePeriod: course.period,
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 overflow-hidden relative"
                  >
                    {/* Contenedor para la animación de desplazamiento */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Símbolo + que se desplaza a la izquierda y desaparece */}
                      <div className="absolute transition-all duration-300 group-hover/btn:translate-x-[-24px] group-hover/btn:opacity-0">
                        <FaPlus className="text-sm" />
                      </div>
                      {/* Icono persona que aparece desde la izquierda y se desplaza hasta el centro */}
                      <div className="absolute transition-all duration-300 translate-x-[-24px] opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100">
                        <FaUser className="text-sm" />
                      </div>
                    </div>
                  </Link>

                  {/* Tooltip - aparece cuando se hace hover sobre el contenedor del botón */}
                  <div className="absolute top-10 right-0 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 opacity-0 pointer-events-none whitespace-nowrap shadow-lg transition-opacity duration-300 group-hover/btn:opacity-100">
                    Agregar estudiantes y roles al curso
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 pr-8">{course.name}</h2>
                  <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{course.acronym} {course.period}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-400">{course.numStudents} estudiantes</div>
                </div>
                <div className="mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Ver detalles
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 dark:text-gray-500">No tienes cursos asignados.</div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex justify-between items-center px-2 py-1 shadow-lg md:hidden z-40">
        <Link to="/dashboard" className="flex flex-col items-center justify-center text-xs text-blue-700 dark:text-blue-400 font-semibold w-1/4">
          <FaHome className="text-lg mb-1" /> Tablero
        </Link>
        <Link to="/teacher-profile" className="flex flex-col items-center justify-center text-xs text-gray-700 dark:text-gray-300 w-1/4">
          <FaBook className="text-lg mb-1" /> Cursos
        </Link>
        <Link to="/support" className="flex flex-col items-center justify-center text-xs text-gray-700 dark:text-gray-300 w-1/4">
          <FaQuestionCircle className="text-lg mb-1" /> Ayuda
        </Link>
      </nav>
    </div>
  );
}




