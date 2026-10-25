"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cases = [
    {
        id: 1,
        title: "Deep Focus",
        category: "Professional",
        image: "bg-blue-900", // Placeholder for image
        quote: "It's like having a superpower for my workflow.",
        user: "Alex C., Software Architect"
    },
    {
        id: 2,
        title: "Peak Performance",
        category: "Athletic",
        image: "bg-red-900",
        quote: "Real-time biometrics without breaking stride.",
        user: "Jordan T., Olympian"
    },
    {
        id: 3,
        title: "Boundless Creation",
        category: "Creative",
        image: "bg-purple-900",
        quote: "The spatial canvas has changed how I design forever.",
        user: "Mia R., 3D Artist"
    },
    {
        id: 4,
        title: "Global Connection",
        category: "Travel",
        image: "bg-emerald-900",
        quote: "Language barriers simply vanished.",
        user: "Liam K., Digital Nomad"
    },
];

export function UseCaseCarousel() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-aura-black">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-10 px-20">
                    {cases.map((item) => (
                        <div
                            key={item.id}
                            className={`relative h-[70vh] w-[80vw] md:w-[60vw] flex-shrink-0 rounded-[3rem] overflow-hidden ${item.image} border border-white/10 group`}
                        >
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-12 w-full">
                                <div className="mb-4 inline-block rounded-full bg-white/10 backdrop-blur-md px-4 py-1 text-sm text-aura-silver border border-white/10">
                                    {item.category}
                                </div>
                                <h3 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 uppercase tracking-tight leading-none">
                                    {item.title}
                                </h3>
                                <blockquote className="text-2xl text-aura-silver mb-8 font-light italic">
                                    "{item.quote}"
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-white/20" />
                                    <span className="text-sm font-bold uppercase tracking-widest text-white/60">{item.user}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
