import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
                <div className="flex h-20 items-center justify-between rounded-b-2xl bg-white/5 backdrop-blur-xl border-x border-b border-white/10 px-6">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                        AURA<span className="font-light text-aura-blue">STORE</span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {["Products", "Features", "Specs", "About"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-medium text-aura-silver hover:text-white transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* CTA using Ghost or Small Primary button */}
                    <div className="flex items-center gap-4">
                        <Button variant="primary" size="default" className="h-10 px-6 text-sm">
                            Pre-Order
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
