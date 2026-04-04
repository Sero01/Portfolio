"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

const springConfig = { stiffness: 50, damping: 15, mass: 1 };
const flipSpring = { stiffness: 40, damping: 12, mass: 1.2 };

export function ProfileCard() {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  const sectionsRef = useRef({
    heroBottom: 0,
    skillsTop: 0,
    skillsBottom: 0,
    expTop: 0,
    expBottom: 0,
  });

  useEffect(() => {
    const measure = () => {
      const skills = document.getElementById("about");
      const experience = document.getElementById("experience");
      if (skills && experience) {
        sectionsRef.current = {
          heroBottom: 0,
          skillsTop: skills.offsetTop,
          skillsBottom: skills.offsetTop + skills.offsetHeight,
          expTop: experience.offsetTop,
          expBottom: experience.offsetTop + experience.offsetHeight,
        };
      }
      setMounted(true);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const lerp = (y: number, start: number, end: number, from: number, to: number) => {
    if (end <= start) return from;
    const t = Math.max(0, Math.min(1, (y - start) / (end - start)));
    return from + t * (to - from);
  };

  // Flip: 0→180 (hero→skills), then 180→360 (skills→experience) — both scroll-driven
  const rawFlip = useTransform(scrollY, (y) => {
    const s = sectionsRef.current;
    if (y < s.heroBottom) return 0;
    if (y < s.skillsTop) return lerp(y, s.heroBottom, s.skillsTop, 0, 180);
    if (y < s.expTop) return lerp(y, s.skillsTop, s.expTop, 180, 360);
    return 360;
  });

  // Slight tilt for Polaroid feel — stays constant
  const rawRotate = useTransform(scrollY, () => -3);

  // Vertical movement: card moves down from hero area to beside the skills section
  const rawTranslateY = useTransform(scrollY, (y) => {
    const s = sectionsRef.current;
    if (y < s.heroBottom) return 0;
    if (y < s.skillsTop) return lerp(y, s.heroBottom, s.skillsTop, 0, 120);
    return 120;
  });

  // Horizontal shift: nudge right towards content from state 2 onwards
  const rawTranslateX = useTransform(scrollY, (y) => {
    const s = sectionsRef.current;
    if (y < s.heroBottom) return 0;
    if (y < s.skillsTop) return lerp(y, s.heroBottom, s.skillsTop, 0, -60);
    return -60;
  });

  // Scale: 1 → 1.3 from state 2 onwards
  const rawScale = useTransform(scrollY, (y) => {
    const s = sectionsRef.current;
    if (y < s.heroBottom) return 1;
    if (y < s.skillsTop) return lerp(y, s.heroBottom, s.skillsTop, 1, 1.3);
    return 1.3;
  });

  // Subtle vertical float — only active before experience
  const rawFloat = useTransform(scrollY, (y) => {
    const s = sectionsRef.current;
    if (y >= s.expTop) return 0;
    return Math.sin(y * 0.005) * 8;
  });

  // Scroll away with experience section instead of fading
  // Once scroll passes the unpin point, card moves up with the page
  const rawScrollAway = useTransform(scrollY, (y) => {
    const s = sectionsRef.current;
    if (s.expBottom === 0) return 0;
    const unpinPoint = s.expBottom - window.innerHeight * 0.5;
    if (y < unpinPoint) return 0;
    return -(y - unpinPoint);
  });

  // Spring-smoothed — trailing physics
  const flipDeg = useSpring(rawFlip, flipSpring);
  const rotateDeg = useSpring(rawRotate, springConfig);
  const translateY = useSpring(rawTranslateY, springConfig);
  const translateX = useSpring(rawTranslateX, springConfig);
  const scale = useSpring(rawScale, springConfig);
  const float = useSpring(rawFloat, { stiffness: 30, damping: 10, mass: 0.8 });
  const scrollAway = useSpring(rawScrollAway, { stiffness: 80, damping: 20 });

  const transform = useTransform(
    [flipDeg, rotateDeg, translateY, translateX, scale, float, scrollAway],
    ([flip, rotate, ty, tx, sc, fl, sa]: number[]) =>
      `translateX(${tx}px) translateY(${ty + fl + sa}px) scale(${sc}) perspective(800px) rotateY(${flip}deg) rotate(${rotate}deg)`
  );

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-[15%] right-[8%] z-40 hidden lg:block"
      style={{ transform, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
    >
      {/* Polaroid frame */}
      <div
        className="relative w-[180px] bg-white p-2 pb-10 rounded-sm shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 bg-white p-2 pb-10 rounded-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="relative w-[164px] h-[200px] overflow-hidden rounded-[1px]">
            <Image
              src="/profile.jpg"
              alt="Parvez"
              fill
              className="object-cover"
              sizes="164px"
              priority
            />
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-500 font-mono tracking-wide">
            Parvez
          </p>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 bg-white p-2 pb-10 rounded-sm"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="relative w-[164px] h-[200px] overflow-hidden rounded-[1px]">
            <Image
              src="/profile_2.jpg"
              alt="Behind the camera"
              fill
              className="object-cover"
              sizes="164px"
              unoptimized
            />
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-500 font-mono tracking-wide">
            Parvez
          </p>
        </div>

        {/* Invisible spacer for dimensions */}
        <div className="invisible">
          <div className="w-[164px] h-[200px]" />
          <p className="mt-2 text-[11px]">&nbsp;</p>
        </div>
      </div>
    </motion.div>
  );
}
