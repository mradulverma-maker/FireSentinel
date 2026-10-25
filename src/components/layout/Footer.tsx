import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-aura-charcoal py-12">
            <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 md:px-12">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">AURA<span className="text-aura-blue">STORE</span></span>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {["About", "Tech Specs", "Support", "Privacy"].map((link) => (
                        <Link key={link} href="#" className="text-sm text-aura-silver hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
                            {link}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    {/* Social Placeholders */}
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="h-6 w-6 rounded-full border border-white/20 bg-white/5 hover:bg-white/20 transition-colors" />
                    ))}
                </div>

                <p className="text-xs text-aura-silver/50">
                    © 2026 AuraStore. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
