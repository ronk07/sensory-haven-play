import { useLocation } from "react-router-dom";

export function useCanonical(): string {
  const location = useLocation();
  if (typeof window === "undefined") return "";
  const origin = window.location.origin;
  return `${origin}${location.pathname}`;
}
