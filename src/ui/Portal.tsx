import { createPortal } from "react-dom";
import { useEffect, useMemo, type ReactNode } from "react";

export default function Portal({ children }: { children: ReactNode }) {
  // se quiser, use um nó dedicado; senão, caia no body
  const target = useMemo(() => {
    let el = document.getElementById("portal-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "portal-root";
      document.body.appendChild(el);
    }
    return el;
  }, []);

  return createPortal(children, target);
}
