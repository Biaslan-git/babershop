"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#about", label: "О нас" },
  { href: "#services", label: "Услуги" },
  { href: "#masters", label: "Мастера" },
  { href: "#gallery", label: "Работы" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contact", label: "Контакты" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="card-shell">
          <div className="card-inner px-6 py-3 flex items-center gap-8">
            <a href="#" className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[var(--gold)]">
                <path d="M6 26L8 24L26 6C27.5 4.5 29 5 29 7L29 9C29 10 28 11 27 11L9 26C8 27 7 27 6 26Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
                <path d="M8 24L6 26L7 27C7.5 27.5 8.5 27.5 9 27L10 26L8 24Z" fill="currentColor"/>
              </svg>
              <div className="flex items-center gap-2 text-lg font-semibold tracking-wide">
                <span className="text-gradient-gold">BLACK</span>
                <span className="w-px h-4 bg-white/20" />
                <span className="text-white/90">BLADE</span>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 hover:text-[var(--gold)] transition-colors duration-300 whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <a
              href="#booking"
              className="hidden md:flex items-center gap-2 bg-[var(--gold)] text-black px-5 py-2.5 rounded-full text-sm font-medium group transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-light)] active:scale-[0.98]"
            >
              <span>Записаться</span>
              <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px transition-transform duration-300">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5v5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>

            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Открыть меню"
            >
              <span className="w-5 h-px bg-white/80" />
              <span className="w-5 h-px bg-white/80" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center"
              aria-label="Закрыть меню"
            >
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: 45 }}
                className="absolute w-6 h-px bg-white"
              />
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: -45 }}
                className="absolute w-6 h-px bg-white"
              />
            </button>

            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="text-3xl font-light text-white/80 hover:text-[var(--gold)] transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#booking"
                onClick={() => setIsOpen(false)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: navLinks.length * 0.08,
                  ease: [0.32, 0.72, 0, 1],
                }}
                className="mt-4 bg-[var(--gold)] text-black px-8 py-4 rounded-full text-lg font-medium"
              >
                Записаться
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
