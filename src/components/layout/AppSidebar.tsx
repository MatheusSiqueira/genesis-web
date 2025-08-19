// AppSidebar.tsx
import { NavLink } from "react-router-dom";
import {
  UsersIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import Logo from "@/assets/logo-genesis.png";

type ItemProps = { to: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string };

function Item({ to, icon: Icon, label }: ItemProps) {
  return (
    <NavLink
      to={to}
      end={to === "/dashboard"} // evita ficar ativo em rotas filhas do dashboard se não quiser
      className={({ isActive }) =>
        [
          "group flex items-center justify-center w-12 h-12 rounded-xl transition",
          "text-white",
          isActive
            ? "bg-white/25 ring-1 ring-white/40 shadow"
            : "hover:bg-white/15",
        ].join(" ")
      }
      aria-label={label}
      title={label}
    >
      <Icon className="h-6 w-6 text-white" />
    </NavLink>
  );
}

export default function AppSidebar() {
  return (
    <aside
      className="
        fixed left-5 top-5 bottom-5 w-16
        rounded-2xl bg-genesis-primary50/95 backdrop-blur
        text-white p-2 flex flex-col items-center gap-3 shadow-card
        z-[60] select-none
        supports-[backdrop-filter]:bg-genesis-primary50/80
      "
    >
      <div className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center">
        <img src={Logo} className="h-7 w-auto" alt="Genesis" />
      </div>
      <nav className="mt-2 flex flex-col gap-2">
        <Item to="/dashboard" icon={Squares2X2Icon} label="Dashboard" />
        <Item to="/pacientes" icon={UsersIcon} label="Pacientes" />
        <Item to="/exames" icon={ClipboardDocumentListIcon} label="Exames" />
      </nav>
    </aside>
  );
}
