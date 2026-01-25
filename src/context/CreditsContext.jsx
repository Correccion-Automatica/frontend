// CreditsContext.jsx (o donde lo tengas)
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
import { useAuth } from "./AuthProvider";

const CreditsContext = createContext(null);

export const useCredits = () => {
    const v = useContext(CreditsContext);
    if (!v) throw new Error("useCredits debe usarse dentro de <CreditsProvider>");
    return v;
};

export default function CreditsProvider({ children }) {
    const { isAuthenticated, user } = useAuth();
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCreditsPending, setIsCreditsPending] = useState(false);

    const fetchCredits = useCallback(async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/users/me");

            const next =
                data?.remainingCredits ??
                data?.remaining_credits ??
                data?.user?.remainingCredits ??
                data?.user?.remaining_credits ??
                0;

            setCredits(Number(next) || 0);
            return Number(next) || 0;
        } catch (err) {
            console.error("Error obteniendo créditos", err);
            setCredits(0);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);


    // Rehidratar créditos al montar
    useEffect(() => {
        fetchCredits();
    }, [fetchCredits]);

    // Sincronizar créditos cuando el usuario se autentica
    useEffect(() => {
        if (isAuthenticated && user) {
            fetchCredits();
        } else if (!isAuthenticated) {
            setCredits(0);
        }
    }, [isAuthenticated, user, fetchCredits]);

    // Escuchar eventos globales de creación de pauta y refrescar créditos
    useEffect(() => {
        let bc;
        try {
            bc = new BroadcastChannel("guideline-status");
        } catch (err) {
            // ignore
            return;
        }

        const onMessage = (event) => {
            const msg = event?.data;
            if (!msg?.type) return;

            if (msg.type === "guideline_generating") {
                setIsCreditsPending(true);
                return;
            }

            if (msg.type === "guideline_created" || msg.type === "guideline_error") {
                setIsCreditsPending(false);
                fetchCredits();
            }
        };

        bc.addEventListener("message", onMessage);

        return () => {
            bc.removeEventListener("message", onMessage);
            bc.close();
        };
    }, [fetchCredits]);

    // Helpers útiles
    const canAfford = useCallback(
        (cost) => (Number(credits) || 0) >= Number(cost || 0),
        [credits]
    );

    const spendCredits = useCallback((cost) => {
        const c = Number(cost || 0);
        setCredits((prev) => Math.max(0, (Number(prev) || 0) - c));
    }, []);

    const addCredits = useCallback((amount) => {
        const a = Number(amount || 0);
        setCredits((prev) => (Number(prev) || 0) + a);
    }, []);

    const value = useMemo(
        () => ({
            credits,
            setCredits,
            loading,
            isCreditsPending,
            refreshCredits: fetchCredits,
            canAfford,
            spendCredits,
            addCredits,
        }),
        [credits, loading, isCreditsPending, fetchCredits, canAfford, spendCredits, addCredits]
    );

    return (
        <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
    );
}

CreditsProvider.propTypes = {
    children: PropTypes.node,
};
