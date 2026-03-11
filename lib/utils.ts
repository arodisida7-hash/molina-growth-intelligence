import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: digits
  }).format(value);
}

export function formatChannelLabel(channel: string) {
  const labels: Record<string, string> = {
    Retail: "Autoservicio",
    Distribuidores: "Distribuidores",
    "Food Service": "Food service",
    "E-commerce": "Comercio electronico",
    "Modern Trade": "Trade moderno"
  };

  return labels[channel] ?? channel;
}
