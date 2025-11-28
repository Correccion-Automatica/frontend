import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { api } from "../lib/axios";
import { normalizeUser } from "../lib/normalizeUser";

const AuthContext = createContext(null);

export const useAuth = () => {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return v;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehidratar sesión al montar
  useEffect(() => {
    (async () => {
      try {
        // Si tu backend NO usa CSRF, puedes borrar esta línea
        // await api.get("/auth/csrf").catch(() => { });
        const { data } = await api.get("/users/me");
        setUser(normalizeUser(data));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Acciones de auth (useCallback para referencias estables)
  const signIn = useCallback(async (email, password) => {
    // Si tu backend NO usa CSRF, borra esta línea
    // await api.get("/auth/csrf").catch(() => { });
    await api.post("/authentication/login", { email, password });
    const { data } = await api.get("/users/me");
    const u = normalizeUser(data);
    setUser(u);
    return u;
  }, []);

  const signUp = useCallback(
    async (fullName, email, firstRole, password, confirmPassword, organizationId) => {
      console.log("entra acá??");
      // Si tu backend NO usa CSRF, borra esta línea
      // await api.get("/auth/csrf").catch(() => { });
      const body = {
        fullName,
        email,
        firstRole,
        password, 
        confirmPassword,
        organizationId
      }
      console.log("body enviándose: ", body);
      const register = await api.post("/authentication/register",
        body
      );
      const u = await signIn(email, password); // o bien usa res.data.user si te lo devuelve
      return u;
    },
    [signIn]
  );

  const signOut = useCallback(async () => {
    await api.post("/authentication/logout").catch(() => { });
    setUser(null);
  }, []);

  // Bandera robusta de autenticación
  const isAuthenticated = Boolean(user && (user.id || user.email));

  // Valor del contexto (useMemo con deps completas)
  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      signIn,
      signUp,
      signOut,
      isAuthenticated,
    }),
    [user, loading, signIn, signUp, signOut, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
