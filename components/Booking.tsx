"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const services = [
  "Мужская стрижка",
  "Стрижка + Борода",
  "Оформление бороды",
  "Королевское бритьё",
];

const masters = [
  "Любой мастер",
  "Александр Волков",
  "Дмитрий Орлов",
  "Максим Соколов",
  "Игорь Лебедев",
];

export default function Booking() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: services[0],
    master: masters[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", formData);
  };

  return (
    <section id="booking" className="relative py-32 md:py-40 overflow-hidden">
      <div className="gradient-orb w-[700px] h-[700px] bg-[var(--gold)] opacity-[0.06] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6">
            Запись
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
            Записаться <span className="text-gradient-gold">онлайн</span>
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            Заполните форму и мы свяжемся с вами для подтверждения записи
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="card-shell">
            <div className="card-inner p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white/50 mb-3">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Иван"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold)]/50 transition-colors duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/50 mb-3">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+7 (999) 123-45-67"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold)]/50 transition-colors duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white/50 mb-3">
                      Услуга
                    </label>
                    <div className="relative">
                      <select
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:border-[var(--gold)]/50 transition-colors duration-300 cursor-pointer"
                      >
                        {services.map((service) => (
                          <option
                            key={service}
                            value={service}
                            className="bg-[#0a0a0a]"
                          >
                            {service}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/50 mb-3">
                      Мастер
                    </label>
                    <div className="relative">
                      <select
                        value={formData.master}
                        onChange={(e) =>
                          setFormData({ ...formData, master: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none focus:outline-none focus:border-[var(--gold)]/50 transition-colors duration-300 cursor-pointer"
                      >
                        {masters.map((master) => (
                          <option
                            key={master}
                            value={master}
                            className="bg-[#0a0a0a]"
                          >
                            {master}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full group flex items-center justify-center gap-3 bg-[var(--gold)] text-black px-8 py-5 rounded-2xl text-lg font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[var(--gold-light)] active:scale-[0.99]"
                >
                  <span>Записаться</span>
                  <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-white/30 text-sm mt-8"
        >
          Или позвоните нам: <a href="tel:+74951234567" className="text-[var(--gold)] hover:underline">+7 (495) 123-45-67</a>
        </motion.p>
      </div>
    </section>
  );
}
