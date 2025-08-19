import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  title: string;
  onNew?: () => void;
  right?: React.ReactNode;

  // 👇 novos props para a busca controlada
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};

export default function AppHeader({
  title,
  onNew,
  right,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar",
}: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white rounded-2xl shadow-card px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {right}
          {onNew && (
            <button
              onClick={onNew}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F9D273] text-[#1C1C1C] px-4 py-2 hover:brightness-95"
            >
              <PlusIcon className="h-5 w-5" />
              Novo
            </button>
          )}
        </div>
      </div>

      {/* busca */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder={searchPlaceholder}
            className="w-full rounded-2xl bg-gray-50 border border-gray-200 pl-10 pr-10 py-2 focus:outline-none"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          {!!searchValue && onSearchChange && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              onClick={() => onSearchChange("")}
              aria-label="Limpar busca"
              title="Limpar"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}