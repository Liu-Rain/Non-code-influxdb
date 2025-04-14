import * as React from "react";

import "@xyflow/react/dist/style.css";

import { type Metadata } from "next";

import "@/app/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Visual Flux",
  description:
    "A drag and drop editor for InfluxDB and the Flux query language",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
