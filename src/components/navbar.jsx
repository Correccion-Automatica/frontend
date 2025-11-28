import { useState, useMemo } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthProvider";


export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { user, loading, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
  };

  // Primer nombre y avatar (si hay user)
  const firstName = useMemo(() => {
    const name = user?.fullName || user?.name || "";
    return name.trim().split(/\s+/)[0] || "";
  }, [user]);

  const userRole = useMemo(() => {
    const raw = user?.role || user?.firstRole || "student";
    const normalized = String(raw).trim().split(/\s+/)[0].toLowerCase();
    return normalized || "student";
  }, [user]);

  let dashboardPath;
  switch (userRole) {
        case "student":
          dashboardPath = "/student-profile"
          break;
        case "teacher":
          dashboardPath = "/teacher-profile"
          break;
        case "admin":
          dashboardPath = "/admin-dashboard"
          break;
        default:
          dashboardPath = "/login"
      }

  const initials = useMemo(() => {
    const name = (user?.fullName || user?.name || user?.email || "").trim();
    if (!name) return "U";
    const parts = name.split(/\s+/);
    return (parts[0]?.[0] || "").concat(parts[1]?.[0] || "").toUpperCase();
  }, [user]);

  const navItem =
    "px-3 py-2 rounded-xl text-sm font-medium transition text-[var(--color-navbar-link)] hover:bg-[var(--color-hover)]";

  const active =
    "text-[var(--color-text)] bg-[var(--color-elevated)] hover:bg-[var(--color-elevated)]";

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[var(--color-surface)] border-b border-[var(--color-border)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--color-onprimary)] font-bold">
              AC
            </span>
            <span className="font-semibold tracking-tight">{t("brand")}</span>
          </Link>

          {/* Desktop nav (solo 4 opciones) */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
              {t("nav.about")}
            </NavLink>
            <NavLink to="/pricing" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
              {t("nav.pricing")}
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}>
              {t("nav.contact")}
            </NavLink>
          </nav>

          {/* Acciones derecha */}
          {!loading && (
            <div className="hidden md:flex items-center gap-3">
              
              {!isAuthenticated ? (
                <>
                  {/* Botón de iniciar sesión atractivo */}
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold rounded-xl 
                               border border-transparent
                               bg-[var(--color-primary)] text-[var(--color-onprimary)]
                               hover:opacity-90 focus:outline-none
                               focus:ring-2 focus:ring-[var(--color-border)]"
                  >
                    {t("auth.login")}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={dashboardPath}
                  >
                    <div className="flex items-center gap-2 max-w-[180px]">
                      <span
                        aria-hidden
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-hover-strong)] text-[var(--color-text)] text-xs font-semibold"
                      >
                        {initials}
                      </span>
                      <span className="truncate text-sm text-[var(--color-muted)]">
                        {t("auth.welcome", { name: firstName || t("auth.user") })}
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium rounded-xl hover:bg-[var(--color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]"
                  >
                    {t("auth.logout")}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Botón hamburguesa y theme toggle móvil */}
          <div className="md:hidden flex items-center gap-2">
            
            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl p-2 hover:bg-[var(--color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]"
              aria-label={t("a11y.openMenu")}
              aria-expanded={open}
            >
              {open ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="px-4 pb-4 pt-1 space-y-1">
          <NavLink onClick={() => setOpen(false)} to="/" className={({ isActive }) => `block ${navItem} ${isActive ? active : ""}`}>
            {t("nav.home")}
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/about" className={({ isActive }) => `block ${navItem} ${isActive ? active : ""}`}>
            {t("nav.about")}
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/pricing" className={({ isActive }) => `block ${navItem} ${isActive ? active : ""}`}>
            {t("nav.pricing")}
          </NavLink>
          <NavLink onClick={() => setOpen(false)} to="/contact" className={({ isActive }) => `block ${navItem} ${isActive ? active : ""}`}>
            {t("nav.contact")}
          </NavLink>

          <div className="pt-2 border-t border-[var(--color-border)] space-y-2">
            {!loading && (!isAuthenticated ? (
              <>
                {/* CTA de login ancho completo en mobile */}
                <Link
                  onClick={() => setOpen(false)}
                  to="/login"
                  className="w-full inline-flex items-center justify-center
                             px-3 py-2 text-sm font-semibold rounded-xl
                             bg-[var(--color-primary)] text-[var(--color-onprimary)]
                             hover:opacity-90 focus:outline-none
                             focus:ring-2 focus:ring-[var(--color-border)]"
                >
                  {t("auth.login")}
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setOpen(false); navigate(dashboardPath); }}
                  className="flex items-center gap-2 px-1 w-full text-left"
                >
                  <span aria-hidden className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-hover-strong)] text-[var(--color-text)] text-xs font-semibold">
                    {initials}
                  </span>
                  <span className="text-sm text-[var(--color-muted)]">
                    {t("auth.welcome", { name: firstName || t("auth.user") })}
                  </span>
                </button>
                <button
                  onClick={() => { handleLogout(); setOpen(false); }}
                  className="w-full text-center px-3 py-2 text-sm font-medium rounded-xl hover:bg-[var(--color-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border)]"
                >
                  {t("auth.logout")}
                </button>
              </>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

