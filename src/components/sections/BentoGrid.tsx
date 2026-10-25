"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Cpu, Wifi, Zap, Eye, Mic, Hand } from "lucide-react";

export function BentoGrid() {
    return (
        <section id="features" className="w-full bg-aura-black py-32 px-6">
            <div className="mx-auto max-w-7xl">
                <h2 className="mb-20 text-center font-display text-5xl font-bold text-white uppercase tracking-tight">
                    Beyond <span className="text-gradient">Reality</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-4 gap-6 h-auto md:h-[1200px]">

                    {/* Large Card 1 - 2x2 */}
                    <GlassCard className="col-span-1 md:col-span-2 md:row-span-2 flex flex-col justify-between overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-aura-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Cpu className="h-16 w-16 text-aura-blue mb-4 relative z-10" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-2">Neural Core</h3>
                            <p className="text-aura-silver">Dedicated NPU for real-time spatial computing and intention prediction.</p>
                        </div>
                    </GlassCard>

                    {/* Medium Card 1 - 2x1 */}
                    <GlassCard className="col-span-1 md:col-span-2 md:row-span-1 flex items-center justify-between group">
                        <div className="flex flex-col">
                            <h3 className="text-2xl font-bold text-white mb-1">Spatial Audio</h3>
                            <p className="text-aura-silver text-sm">360° sound field.</p>
                        </div>
                        <Zap className="h-12 w-12 text-aura-purple group-hover:scale-110 transition-transform" />
                    </GlassCard>

                    {/* Small Card 1 */}
                    <GlassCard className="col-span-1 md:row-span-1 flex flex-col items-center justify-center text-center">
                        <Wifi className="h-10 w-10 text-aura-silver mb-2" />
                        <span className="text-xl font-mono font-bold text-white">Wifi 7</span>
                    </GlassCard>

                    {/* Small Card 2 */}
                    <GlassCard className="col-span-1 md:row-span-1 flex flex-col items-center justify-center text-center">
                        <Eye className="h-10 w-10 text-aura-silver mb-2" />
                        <span className="text-xl font-mono font-bold text-white">8K</span>
                    </GlassCard>

                    {/* Large Card 2 - 2x2 (Right Side) */}
                    <GlassCard className="col-span-1 md:col-span-2 md:row-span-2 flex flex-col justify-end relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tl from-aura-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-white mb-2">Gesture Control</h3>
                            <p className="text-aura-silver">Sub-millimeter hand tracking with zero latency.</p>
                        </div>
                        <Hand className="absolute top-8 right-8 h-20 w-20 text-white/10 group-hover:text-white/30 transition-colors" />
                    </GlassCard>

                    {/* Medium Card 2 */}
                    <GlassCard className="col-span-1 md:col-span-2 md:row-span-1 flex items-center gap-6">
                        <Mic className="h-12 w-12 text-aura-gold" />
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Voice Isolation</h3>
                            <p className="text-aura-silver text-sm">Studio quality input in any environment.</p>
                        </div>
                    </GlassCard>

                </div>
            </div>
        </section>
    );
}
