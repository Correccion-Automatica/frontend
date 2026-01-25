// src/hooks/useCredits.js
import { useContext } from "react";
import { CreditsContext } from "../context/CreditsContext";

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used inside CreditsProvider");
  }
  return context;
}
