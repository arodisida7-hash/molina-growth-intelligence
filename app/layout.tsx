import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Molina Growth Intelligence",
  description:
    "Demo ejecutivo de inteligencia comercial para detectar expansion rentable, presion de margen y prioridades regionales."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
