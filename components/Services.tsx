"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  popular: boolean;
}

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/cms/collections?collection=services")
      .then((res) => res.json())
      .then((data) =>
        setServices(
          data.map((item: { id: string; data: Record<string, unknown> }) => ({
            id: item.id,
            name: item.data.name as string,
            description: item.data.description as string,
            price: item.data.price as number,
            duration: item.data.duration as number,
            popular: item.data.popular as boolean,
          }))
        )
      )
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="relative py-32 md:py-40 overflow-hidden">
      <div className="gradient-orb w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.05] -right-40 top-1/4" />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6">
            Услуги и цены
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Что мы <span className="text-gradient-gold">предлагаем</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
              animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <div className="card-shell h-full group cursor-pointer transition-all duration-500 hover:scale-[1.02]">
                <div className="card-inner h-full p-8 relative overflow-hidden">
                  {service.popular && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.15em] font-medium bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30">
                      Популярное
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--gold)] transition-colors duration-300">
                      {service.name}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-end justify-between mt-auto pt-6 border-t border-white/10">
                    <div>
                      <span className="text-3xl font-semibold text-gradient-gold">
                        {service.price.toLocaleString()}
                      </span>
                      <span className="text-white/40 text-sm ml-1">₽</span>
                    </div>
                    {service.duration > 0 && (
                      <span className="text-white/30 text-sm">{service.duration} мин</span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--gold)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mt-12"
        >
          <p className="text-white/40 text-sm">
            * Все услуги включают консультацию мастера и премиум-косметику
          </p>
        </motion.div>
      </div>
    </section>
  );
}
