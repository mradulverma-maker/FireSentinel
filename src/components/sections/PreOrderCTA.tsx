"use client";

import { Button } from "@/components/ui/Button";
import { MoveRight } from "lucide-react";

export function PreOrderCTA() {
    return (
        <section id="preorder" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-aura-black to-aura-charcoal">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-aura-blue/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase tracking-tight">
                    Future is <span className="text-gradient">Now</span>
                </h2>

                <p className="text-xl text-aura-silver mb-12 max-w-2xl mx-auto font-light">
                    Secure your AuraVision Pro today and experience the next evolution of spatial computing. Limited first batch availability.
                </p>

                {/* Pricing Card */}
                <div className="glass-card mb-12 p-10 max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500">
                    <div className="flex justify-center items-end gap-2 mb-2">
                        <span className="text-5xl font-bold text-white">$599</span>
                        <span className="text-xl text-aura-silver/50 line-through mb-2">$799</span>
                    </div>
                    <div className="text-aura-blue font-mono text-sm mb-8 uppercase tracking-widest">Early Bird Offer</div>

                    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-aura-blue focus:ring-1 focus:ring-aura-blue transition-all"
                        />
                        <Button variant="primary" size="lg" className="w-full group">
                            Reserve Yours <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>

                    <p className="mt-6 text-xs text-aura-silver/40">
                        *fully refundable deposit. Shipping Q3 2026.
                    </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex justify-center gap-8 text-sm text-aura-silver/60 font-mono uppercase tracking-wider">
                    <span>Free Global Shipping</span>
                    <span>•</span>
                    <span>30-Day Trial</span>
                    <span>•</span>
                    <span>2-Year Warranty</span>
                </div>
            </div>
        </section>
    );
}
