import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Black Blade Barbershop | Премиум Мужская Парикмахерская",
  description: "Мужская парикмахерская премиум-класса в Москве. Стрижки, бороды, уход. Мастерство, которое чувствуется.",
  keywords: "барбершоп, мужская стрижка, борода, Москва, премиум",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geist.variable} antialiased`}>
      <body className="bg-[#050505] text-white">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  );
}
