"use client";

export function TechnicalSpecs() {
    const specs = [
        { category: "Dimensions", value: "158.2 x 77.9 x 7.3 mm" },
        { category: "Weight", value: "188g" },
        { category: "Materials", value: "Grade 5 Titanium Alloy, Sapphire Crystal" },
        { category: "Processor", value: "Aura Neural Engine v2" },
        { category: "Display", value: "Micro-OLED, 8000 nits peak" },
        { category: "Battery", value: "48h Active Use" },
        { category: "Connectivity", value: "5G, Wi-Fi 7, Bluetooth 6.3" },
        { category: "Sensors", value: "LiDAR, Accelerometer, Gyroscope" },
    ];

    return (
        <section id="specs" className="w-full bg-aura-slate/50 py-32 px-6">
            <div className="mx-auto max-w-5xl">
                <h2 className="mb-16 text-center font-display text-4xl font-bold text-white">Technical Specifications</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 glass-panel rounded-3xl p-12">
                    {specs.map((spec, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-white/10 pb-4 group hover:border-aura-blue/50 transition-colors">
                            <span className="text-aura-silver font-medium group-hover:text-white transition-colors">{spec.category}</span>
                            <span className="font-mono text-white text-right">{spec.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
