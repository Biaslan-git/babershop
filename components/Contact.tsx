"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface ContactData {
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: { day: string; time: string }[];
  mapCoordinates: string;
}

interface Social {
  id: string;
  name: string;
  href: string;
  icon: string;
}

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="14.5" cy="5.5" r="1" fill="currentColor"/>
    </svg>
  ),
  telegram: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M18 3L9 12M18 3l-6 15-3-6.5L3 8l15-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M17 10a7 7 0 11-2.3-5.2M17 3v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 7v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [data, setData] = useState<ContactData | null>(null);
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    fetch("/api/cms/content?id=contact")
      .then((res) => res.json())
      .then((section) => setData(section.data))
      .catch(() => {});

    fetch("/api/cms/collections?collection=socials")
      .then((res) => res.json())
      .then((items) =>
        setSocials(
          items.map((item: { id: string; data: Record<string, unknown> }) => ({
            id: item.id,
            name: item.data.name as string,
            href: item.data.href as string,
            icon: item.data.icon as string,
          }))
        )
      )
      .catch(() => {});
  }, []);

  const title = data?.title || "Где нас найти";
  const address = data?.address || "Москва, ул. Пречистенка, 15";
  const phone = data?.phone || "+7 (495) 123-45-67";
  const email = data?.email || "hello@blackblade.ru";
  const hours = data?.hours || [
    { day: "Пн - Пт", time: "10:00 — 22:00" },
    { day: "Сб - Вс", time: "10:00 — 20:00" },
  ];

  const contacts = [
    {
      label: "Адрес",
      value: address,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 10.5a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 18s6-4.5 6-9.5a6 6 0 10-12 0c0 5 6 9.5 6 9.5z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      label: "Телефон",
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, "")}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.5 14.5v2a1.5 1.5 0 01-1.6 1.5A14.5 14.5 0 012 4.1 1.5 1.5 0 013.5 2.5h2a1.5 1.5 0 011.5 1.3c.1.8.3 1.6.5 2.3a1.5 1.5 0 01-.3 1.6l-.9.9a12 12 0 005.1 5.1l.9-.9a1.5 1.5 0 011.6-.3c.7.2 1.5.4 2.3.5a1.5 1.5 0 011.3 1.5z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
    },
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 5.5l6.5 5a2 2 0 002.5 0l6-5M3.5 15h13a1 1 0 001-1V6a1 1 0 00-1-1h-13a1 1 0 00-1 1v8a1 1 0 001 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="relative py-32 md:py-40 overflow-hidden">
      <div className="gradient-orb w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.04] -right-40 top-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6">
            Контакты
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-gradient-gold">{title.split(" ").slice(-1)}</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ x: -40, opacity: 0, filter: "blur(10px)" }}
            animate={isInView ? { x: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="card-shell h-full">
              <div className="card-inner h-full p-8 md:p-10">
                <h3 className="text-xl font-semibold mb-8">Контактная информация</h3>

                <div className="space-y-6">
                  {contacts.map((contact) => (
                    <div key={contact.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center flex-shrink-0 text-[var(--gold)]">
                        {contact.icon}
                      </div>
                      <div>
                        <p className="text-sm text-white/40 mb-1">{contact.label}</p>
                        {contact.href ? (
                          <a href={contact.href} className="text-white/90 hover:text-[var(--gold)] transition-colors duration-300">
                            {contact.value}
                          </a>
                        ) : (
                          <p className="text-white/90">{contact.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10">
                  <h4 className="text-sm text-white/40 mb-4">Часы работы</h4>
                  <div className="space-y-2">
                    {hours.map((h) => (
                      <div key={h.day} className="flex justify-between text-white/70">
                        <span>{h.day}</span>
                        <span>{h.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {socials.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <h4 className="text-sm text-white/40 mb-4">Социальные сети</h4>
                    <div className="flex gap-3">
                      {socials.map((social) => (
                        <a
                          key={social.id}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[var(--gold)] hover:border-[var(--gold)]/30 transition-all duration-300"
                          aria-label={social.name}
                        >
                          {socialIcons[social.icon?.toLowerCase()] || socialIcons.telegram}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 40, opacity: 0, filter: "blur(10px)" }}
            animate={isInView ? { x: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="card-shell h-full">
              <div className="card-inner h-full aspect-square md:aspect-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--gold)]/10 via-transparent to-black/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/30 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-[var(--gold)]">
                        <path d="M16 17a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M16 28s9-7 9-15a9 9 0 10-18 0c0 8 9 15 9 15z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <p className="text-white/40 text-sm">Карта</p>
                    <p className="text-white/60 text-sm mt-2">{address}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
