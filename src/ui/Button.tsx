import React, { forwardRef } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";
type Breakpoint = "xs" | "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Esconde o texto (children) abaixo do breakpoint indicado — útil p/ mobile */
  collapseLabelAt?: Breakpoint;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium shadow-sm " +
  "transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-0";

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  // mais compacto no xs; expande a partir de sm
  md: "px-3 sm:px-4 py-2",
  lg: "px-4 sm:px-5 py-3 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-600 text-white ring-1 ring-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500",
  outline:
    "bg-white text-emerald-700 ring-1 ring-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 focus:ring-emerald-500",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 ring-1 ring-transparent",
  danger:
    "bg-red-600 text-white ring-1 ring-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-red-500",
};

const Spinner = () => (
  <ArrowPathIcon className="h-5 w-5 animate-spin shrink-0" aria-hidden="true" />
);

const collapseMap: Record<Breakpoint, string> = {
  xs: "hidden sm:inline",
  sm: "hidden md:inline",
  md: "hidden lg:inline",
  lg: "hidden xl:inline",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth,
    isLoading,
    iconLeft,
    iconRight,
    collapseLabelAt,
    className = "",
    children,
    ...props
  },
  ref
) {
  const classes = [
    base,
    sizes[size],
    variants[variant],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelClass =
    "whitespace-nowrap " + (collapseLabelAt ? collapseMap[collapseLabelAt] : "");

  return (
    <button
      ref={ref}
      className={classes}
      aria-busy={isLoading || undefined}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Spinner /> : iconLeft}
      {/* Esconde o texto no breakpoint configurado (se houver) */}
      <span className={labelClass}>{children}</span>
      {iconRight}
    </button>
  );
});

export default Button;
