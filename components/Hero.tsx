"use client";

import { motion } from "framer-motion";
import { useSection } from "@/lib/cms/hooks";

export default function Hero() {
  const { data, isLoading } = useSection("hero");

  const tag = (data?.tag as string) || "Премиум Барбершоп Москва";
  const title = (data?.title as string) || "Мастерство";
  const subtitle = (data?.subtitle as string) || "в каждом движении";
  const description = (data?.description as string) || "Для мужчин, которые ценят качество. Стрижки, бороды и уход от лучших мастеров города.";
  const backgroundImage = (data?.backgroundImage as string) || "/hero-bg.jpg";
  const buttonPrimary = (data?.buttonPrimary as string) || "Записаться онлайн";
  const buttonSecondary = (data?.buttonSecondary as string) || "Смотреть услуги";

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <div className="gradient-orb w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.08] -top-40 -right-40" />
      <div className="gradient-orb w-[400px] h-[400px] bg-[var(--gold-dark)] opacity-[0.05] bottom-20 -left-20" />

      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/40 to-[#050505]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6 md:mb-8">
            {tag}
          </span>
        </motion.div>

        <motion.h1
          initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
          className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 md:mb-8"
        >
          <span className="text-gradient-gold">{title}</span>
          <br />
          <span className="text-white/90">{subtitle}</span>
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="text-lg md:text-xl text-white/80 max-w-md md:max-w-xl mx-auto mb-10 md:mb-12 font-light"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.45, ease: [0.32, 0.72, 0, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#booking"
            className="group flex items-center gap-3 bg-[var(--gold)] text-black px-8 py-4 rounded-full text-base font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-light)] active:scale-[0.98]"
          >
            <span>{buttonPrimary}</span>
            <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </a>

          <a
            href="#services"
            className="flex items-center gap-2 text-white/60 hover:text-white px-6 py-4 transition-colors duration-300"
          >
            <span>{buttonSecondary}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
