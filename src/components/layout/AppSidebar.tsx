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
      end={to === "/dashboard"}
      className={({ isActive }) =>
        [
          "group flex items-center justify-center w-12 h-12 transition",
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
        fixed left-0 top-0 bottom-0 w-20
        bg-genesis-primary50/95 backdrop-blur
        text-white p-3 flex flex-col items-center gap-4 shadow-xl
        z-30 select-none
        supports-[backdrop-filter]:bg-genesis-primary50/80
      "
    >
      {/* Logo */}
      <div className="w-12 h-12 flex items-center justify-center bg-white/95 rounded-md">
        <img src={Logo} className="h-7 w-auto" alt="Genesis" />
      </div>

      {/* Navegação */}
      <nav className="mt-4 flex flex-col gap-3">
        <Item to="/dashboard" icon={Squares2X2Icon} label="Dashboard" />
        <Item to="/pacientes" icon={UsersIcon} label="Pacientes" />
        <Item to="/exames" icon={ClipboardDocumentListIcon} label="Exames" />
      </nav>
    </aside>
  );
}

