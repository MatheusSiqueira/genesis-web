import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "@/ui/Button";
import Select, { type SelectOption } from "@/ui/Select";

type Props = {
  title: string;
  onNew?: () => void;
  right?: React.ReactNode;

  // busca controlada
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // dropdown (opcional) - tamanho de página
  pageSize?: number;
  onPageSizeChange?: (v: number) => void;
  pageSizeOptions?: number[];

  // estilo/label do botão "Novo"
  newButtonVariant?: "filled" | "outline"; // filled -> Button primary
  newLabel?: string;
};

export default function AppHeader({
  title,
  onNew,
  right,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar",
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 8, 10, 20, 50],
  newButtonVariant = "filled",
  newLabel = "Novo",
}: Props) {
  const buttonVariant = newButtonVariant === "outline" ? "outline" : "primary";

  const pageSizeOpts: SelectOption[] = (pageSizeOptions ?? []).map((n) => ({
    value: n,
    label: `${n} / pág`,
  }));

  return (
    <header className="sticky top-0 z-50 bg-white rounded-2xl shadow-card px-5 py-4 flex flex-col gap-3">
      {/* Topo responsivo: empilha no mobile, lado a lado >= sm */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold min-w-0 truncate">{title}</h1>

        <div className="flex items-center gap-2 shrink-0 sm:justify-end">
          {/* Select reutilizável (opcional) */}
          {typeof pageSize === "number" && onPageSizeChange && (
            <Select
              value={pageSize}
              onChange={(v) => onPageSizeChange(Number(v))}
              options={pageSizeOpts}
              size="md"
              align="right"
              placeholder="Itens / pág"
            />
          )}

          {right}

          {onNew && (
            <Button
              onClick={onNew}
              variant={buttonVariant as "primary" | "outline"}
              size="md"
              className="whitespace-nowrap px-3 sm:px-4"
              iconLeft={<PlusIcon className="h-5 w-5" />}
            >
              {newLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Busca */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            role="searchbox"
            placeholder={searchPlaceholder}
            className="w-full rounded-2xl bg-white ring-1 ring-gray-200 pl-10 pr-10 py-2
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          {!!searchValue && onSearchChange && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
