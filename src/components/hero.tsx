"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative flex items-center pt-16 overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      <div className="mx-auto px-6 sm:px-10 lg:px-16 py-20 w-full relative z-20">
        {/* Main typography block — centered */}
        <div className="relative text-center">
          <motion.div
            className="font-[family-name:'Array'] text-[4.2rem] sm:text-[6.6rem] md:text-[9rem] lg:text-[12.6rem] font-normal leading-[0.85] tracking-[0.04em] select-none"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Creative
          </motion.div>

          {/* BUILD — massive orange */}
          <motion.div
            className="font-[family-name:var(--font-display)] text-[var(--color-accent)] text-[3.8rem] sm:text-[6.2rem] md:text-[8.4rem] lg:text-[11.8rem] font-bold leading-[0.82] tracking-[0.03em] uppercase"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            Software
          </motion.div>

          {/* Innovate — clean black with textured I */}
          <motion.div
            className="font-[family-name:var(--font-display)] text-[3.8rem] sm:text-[6.2rem] md:text-[8.4rem] lg:text-[11.8rem] font-bold leading-[0.82] tracking-[0.03em] uppercase"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            Builder
            <span className="text-[var(--color-accent)]">.</span>
          </motion.div>

          {/* Decorative sun/asterisk — bottom right of text block */}
          <motion.div
            className="absolute -bottom-2 right-[5%] sm:right-[10%] text-[var(--color-accent)]"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="currentColor" className="sm:w-10 sm:h-10 md:w-12 md:h-12">
              <path d="M18 0l3.5 14.5L36 18l-14.5 3.5L18 36l-3.5-14.5L0 18l14.5-3.5z" />
              <circle cx="18" cy="18" r="5" />
            </svg>
          </motion.div>
        </div>

        {/* Subtitle — centered */}
        <motion.div
          className="mt-8 sm:mt-10 flex items-center justify-center gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          <div className="w-8 sm:w-12 h-px bg-[var(--color-border)]" />
          <p className="text-sm sm:text-base text-[var(--color-muted)] tracking-wide">
            Building scalable apps, websites, and automations
          </p>
          <div className="w-8 sm:w-12 h-px bg-[var(--color-border)]" />
        </motion.div>
      </div>
    </section>
  );
}
