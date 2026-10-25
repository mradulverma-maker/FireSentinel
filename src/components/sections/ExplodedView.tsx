"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ExplodedView() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Parallax / Separation effects
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="relative h-[150vh] w-full bg-aura-charcoal overflow-hidden flex items-center justify-center">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center">
                <h2 className="absolute top-20 text-center text-4xl font-display font-bold text-aura-silver opacity-50 uppercase tracking-widest z-0">
                    Precision Engineering
                </h2>

                {/* Simulated Exploded Layers with Simple Shapes */}
                <div className="relative w-[300px] h-[400px] perspective-[1000px]">

                    {/* Layer 1: Screen */}
                    <motion.div
                        style={{ y: y1, rotateX: rotate, opacity }}
                        className="absolute inset-0 bg-blue-500/10 border border-blue-400/30 rounded-3xl backdrop-blur-sm z-30 shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center"
                    >
                        <span className="text-blue-200 font-mono text-xs uppercase tracking-widest">OLED Matrix</span>
                    </motion.div>

                    {/* Layer 2: Core/Frame */}
                    <motion.div
                        style={{ y: y2, rotateX: rotate, opacity }}
                        className="absolute inset-0 bg-gray-900 border border-white/10 rounded-3xl z-20 flex items-center justify-center"
                    >
                        <div className="w-3/4 h-3/4 border border-dashed border-white/20 rounded-xl" />
                    </motion.div>

                    {/* Layer 3: Battery/Back */}
                    <motion.div
                        style={{ y: y3, rotateX: rotate, opacity }}
                        className="absolute inset-0 bg-black border border-white/5 rounded-3xl z-10 flex items-center justify-center"
                    >
                        <div className="w-1/2 h-1/2 bg-aura-slate/50 rounded-lg" />
                    </motion.div>

                    {/* Connecting Lines (Decorative) */}
                    <motion.div style={{ opacity }} className="absolute left-1/2 top-1/2 w-px h-[400px] -translate-y-1/2 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent -z-10" />

                </div>
            </div>
        </section>
    );
}
