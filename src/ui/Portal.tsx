import { type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = { children: ReactNode };

export default function Portal({ children }: Props) {
  // Portal simples: joga o conteúdo para o <body>, sem useEffect
  return createPortal(children, document.body);
}