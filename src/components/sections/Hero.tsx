"use client";

import { motion } from "framer-motion";
import ProductStage from "@/components/3d/ProductStage";
import { Button } from "@/components/ui/Button";
import { ArrowDown } from "lucide-react";

export function Hero() {
    return (
        <section className="relative h-screen w-full overflow-hidden bg-aura-black">
            {/* 3D Background */}
            <ProductStage />

            {/* Content Overlay */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center pointer-events-none">

                {/* Product Name - Fades In */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="font-display text-4xl md:text-6xl font-bold tracking-widest text-aura-silver uppercase mb-8"
                >
                    Aura<span className="text-transparent bg-clip-text bg-gradient-to-r from-aura-blue to-aura-purple">Vision</span> Pro
                </motion.h1>

                {/* Tagline - Staggered Reveal */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.2, delayChildren: 1 }}
                    className="flex gap-4 text-xl md:text-2xl font-light tracking-widest text-white/80"
                >
                    {["Neural.", "Seamless.", "Limitless."].map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 + i * 0.2 }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.div>

            </div>

            {/* Floating Specs (Decorative) */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden md:flex flex-col gap-6 z-10">
                <SpecItem label="Weight" value="142g" delay={1.8} />
                <SpecItem label="Battery" value="48h" delay={2.0} />
            </div>

            <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden md:flex flex-col gap-6 z-10 text-right">
                <SpecItem label="Connectivity" value="5G / Wi-Fi 7" delay={2.2} align="right" />
                <SpecItem label="Latency" value="<1ms" delay={2.4} align="right" />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto cursor-pointer"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="text-xs uppercase tracking-[0.2em] text-aura-silver/60">Explore</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <ArrowDown className="text-aura-blue w-6 h-6" />
                </motion.div>
            </motion.div>
        </section>
    );
}

function SpecItem({ label, value, delay, align = "left" }: { label: string; value: string; delay: number; align?: "left" | "right" }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: align === "left" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay }}
            className={`flex flex-col ${align === "right" ? "items-end" : "items-start"}`}
        >
            <span className="text-xs text-aura-silver/40 uppercase tracking-widest">{label}</span>
            <span className="font-mono text-lg text-white font-medium">{value}</span>
        </motion.div>
    );
}
