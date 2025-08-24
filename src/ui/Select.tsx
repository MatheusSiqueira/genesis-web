import { Fragment, useRef, useEffect, useState } from "react";
import { Listbox, Transition, Portal } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export type SelectOption = {
  value: string | number;
  label: string;
  description?: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
};

export type SelectProps = {
  value: string | number;
  onChange: (v: string | number) => void;
  options: SelectOption[];

  placeholder?: string;
  size?: "sm" | "md";
  align?: "left" | "right";
  fullWidth?: boolean;

  label?: string;
  helperText?: string;
  error?: string;

  className?: string;       // wrapper
  buttonClassName?: string; // botão
  listClassName?: string;   // dropdown
  disabled?: boolean;
};

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Selecionar",
  size = "md",
  align = "right",
  fullWidth,
  label,
  helperText,
  error,
  className = "",
  buttonClassName = "",
  listClassName = "",
  disabled,
}: SelectProps) {
  const selected = options.find((o) => o.value === value);
  const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-3 py-2 text-sm";
  const widthClass = fullWidth ? "w-full" : "w-[9rem]";

  // âncora p/ portal (coordenadas do botão)
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const update = () => setRect(el.getBoundingClientRect());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            ref={btnRef}
            className={`
              inline-flex ${widthClass} items-center justify-between gap-2 rounded-xl
              bg-white ${sizeClasses} font-medium text-gray-900 shadow-sm
              ring-1 ring-gray-300 hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-emerald-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${buttonClassName}
            `}
            aria-label={label || "Selecionar opção"}
          >
            <span className="truncate">
              {selected ? selected.label : <span className="text-gray-500">{placeholder}</span>}
            </span>
            <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
          </Listbox.Button>

          <Portal>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-150"
              enterFrom="opacity-0 -translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-1"
            >
              <Listbox.Options
                className={`
                  fixed z-[10000] max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white p-1
                  shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] focus:outline-none
                  ${listClassName}
                `}
                style={{
                  top: rect ? rect.bottom + 8 : 0,
                  left: rect ? (align === "right" ? rect.right - Math.max(160, rect.width) : rect.left) : 0,
                  width: rect ? Math.max(160, rect.width) : 160,
                }}
              >
                {options.map((opt) => (
                  <Listbox.Option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                    className={({ active, disabled }) =>
                      `
                      flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm
                      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                      ${active ? "bg-emerald-50 text-emerald-700" : "text-gray-800"}
                    `
                    }
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex items-center gap-2">
                          {opt.leftIcon}
                          <div className="flex flex-col">
                            <span className="truncate">{opt.label}</span>
                            {opt.description && (
                              <span className="text-xs text-gray-500 truncate">{opt.description}</span>
                            )}
                          </div>
                        </div>
                        {selected && <CheckIcon className="h-5 w-5 text-emerald-600" />}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Portal>
        </div>
      </Listbox>

      {(helperText || error) && (
        <span className={`text-xs ${error ? "text-red-600" : "text-gray-500"}`}>
          {error ?? helperText}
        </span>
      )}
    </div>
  );
}
