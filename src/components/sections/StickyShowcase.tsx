"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { Activity, Battery, Cpu, Layers } from "lucide-react";

const features = [
    {
        id: 1,
        title: "Neural Architecture",
        description: "Powered by the A14-Z Bionic Neural Engine, processing 10 trillion operations per second.",
        icon: Cpu,
        stat: "10T Ops",
    },
    {
        id: 2,
        title: "Infinite Layers",
        description: "Stacked quantum sensor array allows for unprecedented depth perception and spatial mapping.",
        icon: Layers,
        stat: "0.1nm",
    },
    {
        id: 3,
        title: "Zero Latency",
        description: "Direct-to-brain interface ensures thought-to-action speeds faster than human reflex.",
        icon: Activity,
        stat: "<1ms",
    },
    {
        id: 4,
        title: "Perpetual Energy",
        description: "Self-charging graphene solid-state battery that lasts weeks on a single charge.",
        icon: Battery,
        stat: "21 Days",
    },
];

export function StickyShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCard, setActiveCard] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        // Determine active card based on scroll progress
        // We have 4 cards, so we split 0-1 into 4 segments roughly
        const step = 1 / features.length;
        const index = Math.min(Math.floor(latest / step), features.length - 1);
        if (index !== activeCard) {
            setActiveCard(index);
        }
    });

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-aura-charcoal">
            <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">

                {/* Left Side: Product Visualization (Sticky) */}
                <div className="flex h-full w-full items-center justify-center p-8 lg:w-1/2">
                    <div className="relative flex aspect-square w-full max-w-lg items-center justify-center rounded-full bg-aura-black/50 shadow-2xl backdrop-blur-sm border border-white/5">
                        {/* Placeholder for Dynamic Product State */}
                        <motion.div
                            key={activeCard}
                            initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative z-10 text-9xl font-bold text-aura-silver/20"
                        >
                            {/* Simulating different views */}
                            {activeCard === 0 && <Cpu className="w-48 h-48 text-aura-blue animate-pulse" />}
                            {activeCard === 1 && <Layers className="w-48 h-48 text-aura-purple animate-pulse" />}
                            {activeCard === 2 && <Activity className="w-48 h-48 text-aura-gold animate-pulse" />}
                            {activeCard === 3 && <Battery className="w-48 h-48 text-green-400 animate-pulse" />}
                        </motion.div>

                        {/* Background glow specific to feature */}
                        <div className={cn(
                            "absolute inset-0 rounded-full blur-[100px] transition-colors duration-1000 opacity-30",
                            activeCard === 0 && "bg-aura-blue",
                            activeCard === 1 && "bg-aura-purple",
                            activeCard === 2 && "bg-aura-gold",
                            activeCard === 3 && "bg-green-500"
                        )} />
                    </div>
                </div>

                {/* Right Side: Scrollable Content (Takes up 50% width on Desktop) */}
                <div className="hidden h-full w-1/2 items-center justify-center lg:flex">
                    {/* This area is kept empty or decoration, the actual scrolling content overlays or is structured differently.
               Actually, for sticky scroll, the content normally scrolls naturally on the right. 
               Let's adjust layout: The container is tall, the sticky part is "sticky". 
               The content needs to also be inside the tall container.
           */}
                </div>
            </div>

            {/* Floating ContentOverlay that scrolls */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2">
                {features.map((feature, index) => (
                    <div key={feature.id} className="flex h-screen w-full items-center justify-center p-8">
                        <GlassCard className={cn(
                            "w-full max-w-md transition-all duration-500",
                            activeCard === index ? "opacity-100 scale-100 bg-white/10" : "opacity-30 scale-95"
                        )}>
                            <feature.icon className="mb-4 h-12 w-12 text-aura-blue" />
                            <h3 className="text-3xl font-bold font-display mb-2">{feature.title}</h3>
                            <p className="text-aura-silver text-lg mb-6">{feature.description}</p>
                            <div className="inline-block rounded-full bg-white/5 px-4 py-2 border border-white/10">
                                <span className="font-mono text-aura-gold">{feature.stat}</span>
                            </div>
                        </GlassCard>
                    </div>
                ))}
            </div>
        </section>
    );
}
