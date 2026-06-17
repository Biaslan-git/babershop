"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  service: string;
}

export default function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch("/api/cms/collections?collection=reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(
          data.map((item: { id: string; data: Record<string, unknown> }) => ({
            id: item.id,
            name: item.data.name as string,
            text: item.data.text as string,
            rating: (item.data.rating as number) || 5,
            service: item.data.service as string,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section id="reviews" className="relative py-32 md:py-40 overflow-hidden">
      <div className="gradient-orb w-[500px] h-[500px] bg-[var(--gold)] opacity-[0.04] -left-40 bottom-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-medium bg-white/5 border border-white/10 text-[var(--gold)] mb-6">
            Отзывы
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
            Что говорят <span className="text-gradient-gold">клиенты</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
              animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <div className="card-shell h-full">
                <div className="card-inner h-full p-8 flex flex-col">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <svg
                        key={j}
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="var(--gold)"
                      >
                        <path d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7L8 1z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote
                    className="richtext-content text-white/70 leading-relaxed mb-8 flex-1"
                    dangerouslySetInnerHTML={{ __html: review.text }}
                  />

                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white/90">{review.name}</p>
                        <p className="text-sm text-white/40">{review.service}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center">
                        <span className="text-xs font-medium text-[var(--gold)]">
                          {review.name.split(" ")[0][0]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex justify-center gap-8 mt-16"
        >
          {[
            { value: "4.9", label: "Рейтинг на Яндексе" },
            { value: "500+", label: "Отзывов" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-semibold text-gradient-gold">
                {stat.value}
              </div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
