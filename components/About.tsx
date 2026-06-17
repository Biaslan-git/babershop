"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AboutData {
  tag: string;
  title: string;
  content: string;
  quote: string;
  stats: { value: string; label: string }[];
  image: string;
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch("/api/cms/content?id=about")
      .then((res) => res.json())
      .then((section) => setData(section.data))
      .catch(() => {});
  }, []);

  const tag = data?.tag || "О нас";
  const title = data?.title || "Философия Black Blade";
  const content = data?.content || "";
  const quote = data?.quote || "Качество — это не роскошь, а стандарт";
  const stats = data?.stats || [
    { value: "8+", label: "Лет опыта" },
    { value: "12K", label: "Клиентов" },
    { value: "6", label: "Мастеров" },
  ];

  return (
    <section id="about" className="relative py-32 md:py-40 overflow-hidden">
      <div className="gradient-orb w-[500px] h-[500px] bg-[var(--gold)] opacity-[0.04] top-0 left-1/4" />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ x: -60, opacity: 0, filter: "blur(10px)" }}
            animate={isInView ? { x: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6">
              {tag}
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-8">
              {title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-gradient-gold">{title.split(" ").slice(-2).join(" ")}</span>
            </h2>

            <div
              className="richtext-content space-y-6 text-white/50 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="grid grid-cols-3 gap-8 mt-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 30, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + i * 0.1,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <div className="text-3xl md:text-4xl font-semibold text-gradient-gold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0, filter: "blur(10px)" }}
            animate={isInView ? { x: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="relative"
          >
            <div className="card-shell">
              <div className="card-inner aspect-[4/5] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/20 via-transparent to-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-[var(--gold)]">
                        <path d="M20 4v32M4 20h32" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M20 12v16M12 20h16" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <p className="text-white/30 text-sm">Интерьер салона</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ rotate: 0 }}
              animate={isInView ? { rotate: -3 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-8 -left-8 w-48 h-32"
            >
              <div className="card-shell h-full">
                <div className="card-inner h-full flex items-center justify-center px-6">
                  <p className="text-sm text-white/60 italic">
                    &ldquo;{quote}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
