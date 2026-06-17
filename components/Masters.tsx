"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Master {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialty: string;
  initials: string;
  photo: string;
}

export default function Masters() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [masters, setMasters] = useState<Master[]>([]);

  useEffect(() => {
    fetch("/api/cms/collections?collection=masters")
      .then((res) => res.json())
      .then((data) =>
        setMasters(
          data.map((item: { id: string; data: Record<string, unknown> }) => ({
            id: item.id,
            name: item.data.name as string,
            role: item.data.role as string,
            experience: item.data.experience as string,
            specialty: item.data.specialty as string,
            initials: item.data.initials as string,
            photo: item.data.photo as string,
          }))
        )
      )
      .catch(() => {});
  }, []);

  return (
    <section id="masters" className="relative py-32 md:py-40 overflow-hidden">
      <div className="gradient-orb w-[500px] h-[500px] bg-[var(--gold)] opacity-[0.04] -left-40 top-1/3" />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6">
            Команда
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Наши <span className="text-gradient-gold">мастера</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {masters.map((master, i) => (
            <motion.div
              key={master.id}
              initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
              animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <div className="card-shell h-full group">
                <div className="card-inner h-full p-6 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--gold)]/30 via-[var(--gold)]/10 to-transparent" />
                    {master.photo ? (
                      <img
                        src={master.photo}
                        alt={master.name}
                        className="absolute inset-1 rounded-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-1 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                        <span className="text-2xl font-semibold text-gradient-gold">
                          {master.initials || master.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full border border-[var(--gold)]/20 group-hover:border-[var(--gold)]/40 transition-colors duration-500" />
                  </div>

                  <h3 className="text-lg font-semibold mb-1 group-hover:text-[var(--gold)] transition-colors duration-300">
                    {master.name}
                  </h3>
                  <p className="text-[var(--gold)]/80 text-sm mb-4">{master.role}</p>

                  <div className="space-y-2 text-sm">
                    {master.experience && (
                      <div className="flex justify-between text-white/40">
                        <span>Опыт</span>
                        <span className="text-white/70">{master.experience}</span>
                      </div>
                    )}
                    {master.specialty && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-white/50 text-xs leading-relaxed">
                          {master.specialty}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
