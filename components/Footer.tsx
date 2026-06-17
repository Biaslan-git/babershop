"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FooterData {
  logo: string;
  tagline: string;
  copyright: string;
}

interface ContactData {
  phone: string;
  hours: { day: string; time: string }[];
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    fetch("/api/cms/content?id=footer")
      .then((res) => res.json())
      .then((section) => setFooterData(section.data))
      .catch(() => {});

    fetch("/api/cms/content?id=contact")
      .then((res) => res.json())
      .then((section) => setContactData(section.data))
      .catch(() => {});

    fetch("/api/cms/collections?collection=navigation")
      .then((res) => res.json())
      .then((items) =>
        setNavItems(
          items.map((item: { id: string; data: Record<string, unknown> }) => ({
            id: item.id,
            label: item.data.label as string,
            href: item.data.href as string,
          }))
        )
      )
      .catch(() => {});
  }, []);

  const logo = footerData?.logo || "BLACK BLADE";
  const tagline = footerData?.tagline || "Премиум барбершоп в Москве";
  const copyright = footerData?.copyright || `© ${new Date().getFullYear()} Black Blade Barbershop. Все права защищены.`;
  const phone = contactData?.phone || "+7 (495) 123-45-67";
  const hours = contactData?.hours?.[0]?.time || "10:00 — 22:00";

  const defaultNavItems = [
    { id: "1", label: "О нас", href: "#about" },
    { id: "2", label: "Услуги", href: "#services" },
    { id: "3", label: "Мастера", href: "#masters" },
    { id: "4", label: "Работы", href: "#gallery" },
    { id: "5", label: "Отзывы", href: "#reviews" },
    { id: "6", label: "Контакты", href: "#contact" },
  ];

  const links = navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <footer className="relative py-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true }}
          >
            <a href="#" className="flex items-center gap-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-[var(--gold)]">
                <path d="M6 26L8 24L26 6C27.5 4.5 29 5 29 7L29 9C29 10 28 11 27 11L9 26C8 27 7 27 6 26Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
                <path d="M8 24L6 26L7 27C7.5 27.5 8.5 27.5 9 27L10 26L8 24Z" fill="currentColor"/>
              </svg>
              <div className="flex items-center gap-2 text-xl font-semibold tracking-wide">
                <span className="text-gradient-gold">{logo.split(" ")[0]}</span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-white/90">{logo.split(" ").slice(1).join(" ") || "BLADE"}</span>
              </div>
            </a>
            <p className="text-white/40 text-sm mt-2">{tagline}</p>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 text-sm text-white/40"
          >
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="hover:text-[var(--gold)] transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            viewport={{ once: true }}
            className="text-center md:text-right"
          >
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors duration-300"
            >
              {phone}
            </a>
            <p className="text-white/30 text-sm mt-1">Ежедневно {hours}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30"
        >
          <p>{copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/50 transition-colors duration-300">
              Политика конфиденциальности
            </a>
            <a href="#" className="hover:text-white/50 transition-colors duration-300">
              Оферта
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
