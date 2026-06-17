"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

export default function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/cms/collections?collection=gallery")
      .then((res) => res.json())
      .then((data) =>
        setItems(
          data.map((item: { id: string; data: Record<string, unknown> }) => ({
            id: item.id,
            title: item.data.title as string,
            category: item.data.category as string,
            image: item.data.image as string,
          }))
        )
      )
      .catch(() => {});
  }, []);

  return (
    <section id="gallery" className="relative py-32 md:py-40 overflow-hidden">
      <div className="gradient-orb w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.05] right-0 top-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6">
            Портфолио
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Наши <span className="text-gradient-gold">работы</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
              animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.32, 0.72, 0, 1],
              }}
              className={i === 1 || i === 3 ? "md:row-span-2" : ""}
            >
              <div className="card-shell h-full group cursor-pointer overflow-hidden">
                <div className={`card-inner ${i === 1 || i === 3 ? "aspect-[4/5] md:h-full" : "aspect-square"} relative overflow-hidden`}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || item.category}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/10 via-transparent to-black/60" />
                  )}

                  {!item.image && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--gold)]/30 transition-all duration-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/30 group-hover:text-[var(--gold)] transition-colors duration-300">
                          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.15em] bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
                      {item.category || item.title}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-[var(--gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-white/50 hover:text-[var(--gold)] transition-colors duration-300"
          >
            <span className="text-sm">Больше работ в Instagram</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
