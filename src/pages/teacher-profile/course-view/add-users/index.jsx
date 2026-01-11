import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import * as XLSX from "xlsx";
import BackButton from "../../../../components/BackButton";
import { FaUser, FaUserTie, FaGraduationCap, FaPlus, FaFileExcel, FaEnvelope, FaTrash, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter } from "react-icons/fa";

export default function AddUsersToCourse() {
  const { courseId } = useParams();
  const location = useLocation();
  const { courseName, courseCode, coursePeriod } = location.state || {};

  // Estados
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // "all", "STUDENT", "AUXILIARY_TEACHER"
  
  // Estados para agregar usuarios
  const [manualEmails, setManualEmails] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState([]);
  const [addingUsers, setAddingUsers] = useState(false);
  const [addMethod, setAddMethod] = useState("manual"); // "manual" o "excel"
  
  // Refs para animaciones
  const enrolledPanelRef = useRef(null);
  const addPanelRef = useRef(null);
  const cardsRef = useRef([]);

  // Cargar usuarios inscritos
  useEffect(() => {
    const fetchEnrolledUsers = async () => {
      try {
        setLoading(true);
        // TODO: Reemplazar con el endpoint real cuando esté disponible
        // const response = await api.get(`/courses/${courseId}/users`);
        // setEnrolledUsers(response.data);
        
        // Datos de ejemplo para desarrollo
        setEnrolledUsers([
          { id: 1, email: "estudiante1@example.com", fullName: "Juan Pérez", role: "STUDENT" },
          { id: 2, email: "estudiante2@example.com", fullName: "María González", role: "STUDENT" },
          { id: 3, email: "auxiliar1@example.com", fullName: "Carlos Rodríguez", role: "AUXILIARY_TEACHER" },
        ]);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("No se pudieron cargar los usuarios inscritos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledUsers();
  }, [courseId]);

  // Animaciones al montar
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        enrolledPanelRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
      gsap.fromTo(
        addPanelRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power3.out" }
      );
      
      // Animación escalonada de las tarjetas
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [loading]);

  // Función para obtener el icono según el rol
  const getRoleIcon = (role) => {
    switch (role) {
      case "AUXILIARY_TEACHER":
        return <FaUserTie className="text-blue-500" />;
      case "STUDENT":
        return <FaGraduationCap className="text-green-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  // Función para obtener el texto del rol
  const getRoleText = (role) => {
    switch (role) {
      case "AUXILIARY_TEACHER":
        return "Docente Auxiliar";
      case "STUDENT":
        return "Estudiante";
      default:
        return "Usuario";
    }
  };

  // Función para obtener el color del badge según el rol
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "AUXILIARY_TEACHER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "STUDENT":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  // Manejar cambio de método de agregar usuarios
  const handleMethodChange = (method) => {
    setAddMethod(method);
    setManualEmails("");
    setSelectedFile(null);
    setFileName("");
    setFilePreview([]);
  };

  // Manejar archivo Excel
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar extensión
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError("Por favor selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv)");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError(null);

    // Leer y previsualizar el archivo
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          
          // Obtener la primera hoja
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convertir a JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            setError("El archivo Excel está vacío.");
            setSelectedFile(null);
            setFileName("");
            return;
          }

          // Validar formato: debe tener al menos apellidos, nombres y correo
          const headers = jsonData[0];
          if (!headers || headers.length < 3) {
            setError("El archivo debe tener al menos 3 columnas: Apellidos, Nombres y Correo.");
            setSelectedFile(null);
            setFileName("");
            return;
          }

          // Previsualizar datos (primeras 6 filas incluyendo encabezado)
          const previewRows = jsonData.slice(0, Math.min(6, jsonData.length));
          const previewData = previewRows.map((row, index) => ({
            row: index + 1,
            apellidos: row[0]?.toString().trim() || "",
            nombres: row[1]?.toString().trim() || "",
            correo: row[2]?.toString().trim() || "",
          }));

          setFilePreview(previewData);
        } catch (err) {
          console.error("Error al procesar archivo:", err);
          setError("Error al leer el archivo. Asegúrate de que tenga el formato correcto.");
          setSelectedFile(null);
          setFileName("");
        }
      };

      reader.onerror = () => {
        setError("Error al leer el archivo.");
        setSelectedFile(null);
        setFileName("");
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error al leer archivo:", err);
      setError("Error al leer el archivo. Asegúrate de que tenga el formato correcto.");
      setSelectedFile(null);
      setFileName("");
    }
  };

  // Validar y procesar correos manuales
  const parseManualEmails = () => {
    const emails = manualEmails
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    // Validar formato de correos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setError(`Los siguientes correos no son válidos: ${invalidEmails.join(", ")}`);
      return null;
    }

    return emails;
  };

  // Agregar usuarios manualmente
  const handleAddManualUsers = async () => {
    const emails = parseManualEmails();
    if (!emails || emails.length === 0) {
      setError("Por favor ingresa al menos un correo válido.");
      return;
    }

    setAddingUsers(true);
    setError(null);

    try {
      // TODO: Reemplazar con el endpoint real cuando esté disponible
      // await api.post(`/courses/${courseId}/users/invite`, { emails, role: "STUDENT" });
      
      // Simulación
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Actualizar lista de usuarios
      const newUsers = emails.map((email, index) => ({
        id: Date.now() + index,
        email,
        fullName: email.split("@")[0],
        role: "STUDENT",
      }));
      
      setEnrolledUsers((prev) => [...prev, ...newUsers]);
      setManualEmails("");
      
      // Animación de éxito
      gsap.to(addPanelRef.current, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    } catch (err) {
      console.error("Error al agregar usuarios:", err);
      setError("No se pudieron agregar los usuarios. Intenta nuevamente.");
    } finally {
      setAddingUsers(false);
    }
  };

  // Agregar usuarios desde Excel
  const handleAddExcelUsers = async () => {
    if (!selectedFile) {
      setError("Por favor selecciona un archivo Excel.");
      return;
    }

    setAddingUsers(true);
    setError(null);

    try {
      // Leer el archivo Excel
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          
          // Obtener la primera hoja
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convertir a JSON (sin header, solo datos)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            setError("El archivo Excel está vacío.");
            setAddingUsers(false);
            return;
          }

          // Procesar datos: Columna A (apellidos), B (nombres), C (correo)
          const users = [];
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const invalidRows = [];

          jsonData.forEach((row, index) => {
            const apellidos = row[0]?.toString().trim() || "";
            const nombres = row[1]?.toString().trim() || "";
            const correo = row[2]?.toString().trim() || "";

            if (!correo || !emailRegex.test(correo)) {
              invalidRows.push(index + 1);
              return;
            }

            users.push({
              apellidos,
              nombres,
              correo,
              fullName: `${nombres} ${apellidos}`.trim() || correo.split("@")[0],
            });
          });

          if (invalidRows.length > 0) {
            setError(`Las filas ${invalidRows.join(", ")} tienen correos inválidos o faltantes.`);
            setAddingUsers(false);
            return;
          }

          if (users.length === 0) {
            setError("No se encontraron usuarios válidos en el archivo.");
            setAddingUsers(false);
            return;
          }

          // Enviar al backend
          // TODO: Reemplazar con el endpoint real cuando esté disponible
          // const formData = new FormData();
          // formData.append("file", selectedFile);
          // await api.post(`/courses/${courseId}/users/invite/excel`, formData, {
          //   headers: { "Content-Type": "multipart/form-data" },
          // });
          
          // O enviar los datos procesados:
          // await api.post(`/courses/${courseId}/users/invite/bulk`, { users, role: "STUDENT" });
          
          // Simulación
          await new Promise((resolve) => setTimeout(resolve, 2000));
          
          // Actualizar lista de usuarios (simulación)
          const newUsers = users.map((user, index) => ({
            id: Date.now() + index,
            email: user.correo,
            fullName: user.fullName,
            role: "STUDENT",
          }));
          
          setEnrolledUsers((prev) => [...prev, ...newUsers]);
          
          // Limpiar
          setSelectedFile(null);
          setFileName("");
          setFilePreview([]);
          
          // Animación de éxito
          gsap.to(addPanelRef.current, {
            scale: 1.02,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          });
        } catch (err) {
          console.error("Error al procesar Excel:", err);
          setError("No se pudo procesar el archivo Excel. Verifica el formato e intenta nuevamente.");
          setAddingUsers(false);
        }
      };

      reader.onerror = () => {
        setError("Error al leer el archivo.");
        setAddingUsers(false);
      };

      reader.readAsArrayBuffer(selectedFile);
    } catch (err) {
      console.error("Error al agregar usuarios desde Excel:", err);
      setError("No se pudo procesar el archivo Excel. Verifica el formato e intenta nuevamente.");
      setAddingUsers(false);
    }
  };

  // Filtrar usuarios según búsqueda y rol
  const filteredUsers = enrolledUsers.filter((user) => {
    const matchesSearch = 
      !searchQuery ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Eliminar usuario (opcional)
  const handleRemoveUser = async (userId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar a este usuario del curso?")) {
      return;
    }

    try {
      // TODO: Reemplazar con el endpoint real cuando esté disponible
      // await api.delete(`/courses/${courseId}/users/${userId}`);
      
      setEnrolledUsers((prev) => prev.filter((user) => user.id !== userId));
      
      // Animación de eliminación
      const cardIndex = cardsRef.current.findIndex((ref) => ref?.dataset?.userId === String(userId));
      if (cardIndex !== -1 && cardsRef.current[cardIndex]) {
        gsap.to(cardsRef.current[cardIndex], {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setEnrolledUsers((prev) => prev.filter((user) => user.id !== userId));
          },
        });
      }
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError("No se pudo eliminar el usuario. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-6 px-4 md:px-8 lg:px-12">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <BackButton 
              fallback={`/teacher-profile/course-view/${courseId}`}
              label="Volver"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-4">
              Gestión de Usuarios
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
              {courseName && `${courseName} (${courseCode}) - ${coursePeriod}`}
            </p>
          </div>
        </div>

        {/* Panel de Usuarios Inscritos */}
        <div
          ref={enrolledPanelRef}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FaUser className="text-blue-600 dark:text-blue-400 text-lg" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Usuarios Inscritos
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredUsers.length} de {enrolledUsers.length} {enrolledUsers.length === 1 ? "usuario" : "usuarios"}
                  {searchQuery || roleFilter !== "all" ? " (filtrado)" : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          {enrolledUsers.length > 0 && (
            <div className="mb-6 space-y-3">
              {/* Búsqueda */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre o correo..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtros por rol */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <FaFilter className="text-xs" />
                  Filtrar por rol:
                </span>
                <button
                  onClick={() => setRoleFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    roleFilter === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setRoleFilter("STUDENT")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    roleFilter === "STUDENT"
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <FaGraduationCap className="text-xs" />
                  Estudiantes
                </button>
                <button
                  onClick={() => setRoleFilter("AUXILIARY_TEACHER")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    roleFilter === "AUXILIARY_TEACHER"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <FaUserTie className="text-xs" />
                  Docentes Auxiliares
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-4">Cargando usuarios...</p>
            </div>
          ) : error && !addingUsers ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          ) : enrolledUsers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <FaUser className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No hay usuarios inscritos aún.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron usuarios con los filtros aplicados.
              </p>
              {(searchQuery || roleFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setRoleFilter("all");
                  }}
                  className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
                {filteredUsers.map((user) => {
                  // Encontrar el índice original en enrolledUsers para el ref
                  const originalIndex = enrolledUsers.findIndex((u) => u.id === user.id);
                  return (
                    <div
                      key={user.id}
                      ref={(el) => {
                        if (el && originalIndex !== -1) {
                          cardsRef.current[originalIndex] = el;
                          el.dataset.userId = user.id;
                        }
                      }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 group"
                    >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.fullName || "Sin nombre"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                      title="Eliminar usuario"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      {getRoleText(user.role)}
                    </span>
                  </div>
                </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Panel de Agregar Usuarios */}
        <div
          ref={addPanelRef}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <FaPlus className="text-green-600 dark:text-green-400 text-lg" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Agregar Usuarios
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Invita estudiantes o docentes auxiliares al curso
              </p>
            </div>
          </div>

          {/* Selector de método */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => handleMethodChange("manual")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                addMethod === "manual"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <FaEnvelope />
              <span>Manual</span>
            </button>
            <button
              onClick={() => handleMethodChange("excel")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                addMethod === "excel"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <FaFileExcel />
              <span>Excel</span>
            </button>
          </div>

          {/* Método Manual */}
          {addMethod === "manual" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correos electrónicos
                </label>
                <textarea
                  value={manualEmails}
                  onChange={(e) => setManualEmails(e.target.value)}
                  placeholder="Ingresa los correos separados por comas o líneas nuevas. Ejemplo:&#10;estudiante1@example.com&#10;estudiante2@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={6}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Separa los correos con comas o líneas nuevas
                </p>
              </div>
              <button
                onClick={handleAddManualUsers}
                disabled={addingUsers || !manualEmails.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {addingUsers ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Agregando usuarios...</span>
                  </>
                ) : (
                  <>
                    <FaPlus />
                    <span>Agregar Usuarios</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Método Excel */}
          {addMethod === "excel" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Archivo Excel
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="excel-file-input"
                  />
                  <label
                    htmlFor="excel-file-input"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <FaFileExcel className="text-4xl text-gray-400 dark:text-gray-500" />
                    <div>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        Haz clic para seleccionar
                      </span>
                      <span className="text-gray-500 dark:text-gray-400"> o arrastra el archivo aquí</span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Formatos soportados: .xlsx, .xls, .csv
                    </p>
                  </label>
                </div>
              </div>

              {filePreview.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-green-500" />
                    <div className="flex-1">
                      <span className="font-medium text-green-700 dark:text-green-400 block">
                        Archivo seleccionado: {fileName}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Vista previa ({filePreview.length} {filePreview.length === 1 ? "fila" : "filas"})
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-green-300 dark:border-green-700">
                          <th className="text-left py-2 px-3 font-semibold text-green-800 dark:text-green-300">Fila</th>
                          <th className="text-left py-2 px-3 font-semibold text-green-800 dark:text-green-300">Apellidos</th>
                          <th className="text-left py-2 px-3 font-semibold text-green-800 dark:text-green-300">Nombres</th>
                          <th className="text-left py-2 px-3 font-semibold text-green-800 dark:text-green-300">Correo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filePreview.map((row, index) => (
                          <tr 
                            key={index} 
                            className={`border-b border-green-200 dark:border-green-800 ${
                              index === 0 ? "bg-green-100 dark:bg-green-900/30" : ""
                            }`}
                          >
                            <td className="py-2 px-3 text-green-700 dark:text-green-400 font-medium">
                              {row.row === 1 ? "Encabezado" : row.row}
                            </td>
                            <td className="py-2 px-3 text-green-700 dark:text-green-400">
                              {row.apellidos || "-"}
                            </td>
                            <td className="py-2 px-3 text-green-700 dark:text-green-400">
                              {row.nombres || "-"}
                            </td>
                            <td className="py-2 px-3 text-green-700 dark:text-green-400">
                              {row.correo || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filePreview.length > 6 && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 italic">
                      Mostrando las primeras 6 filas...
                    </p>
                  )}
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                  Formato requerido del Excel:
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Columna A: Apellidos</li>
                  <li>Columna B: Nombres</li>
                  <li>Columna C: Correo electrónico</li>
                </ul>
              </div>

              <button
                onClick={handleAddExcelUsers}
                disabled={addingUsers || !selectedFile}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                {addingUsers ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando archivo...</span>
                  </>
                ) : (
                  <>
                    <FaFileExcel />
                    <span>Procesar y Agregar Usuarios</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Mensaje de error */}
          {error && addingUsers && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <FaTimesCircle className="text-red-500" />
                <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

