export default function Services() {
    const services = [
        {
            title: "Dental Implants",
            description:
                "Permanent tooth replacement solutions designed for long-term function and aesthetics.",
            icon: "🦷",
        },
        {
            title: "Teeth Whitening",
            description:
                "Professional whitening treatments for brighter, more confident smiles.",
            icon: "✨",
        },
        {
            title: "Cosmetic Dentistry",
            description:
                "Transform your smile with veneers, bonding, and smile makeovers.",
            icon: "😁",
        },
        {
            title: "Orthodontics",
            description:
                "Modern teeth alignment treatments including clear aligners and braces.",
            icon: "📏",
        },
        {
            title: "Root Canal Treatment",
            description:
                "Advanced endodontic care focused on saving natural teeth.",
            icon: "🩺",
        },
        {
            title: "Pediatric Dentistry",
            description:
                "Gentle and friendly dental care designed specifically for children.",
            icon: "👶",
        },
        {
            title: "Emergency Dental Care",
            description:
                "Immediate treatment for dental pain, infection, and trauma.",
            icon: "🚨",
        },
        {
            title: "Smile Makeovers",
            description:
                "Comprehensive treatment plans that completely transform your smile.",
            icon: "🌟",
        },
    ];

    return (
        <section
            id="services"
            className="py-32 bg-white"
        >
            <div className="max-w-7xl mx-auto px-6">

                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-24"></div>

                <div className="max-w-3xl mx-auto text-center">

                    <span className="inline-flex items-center bg-cyan-50 border border-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
                        Premium Dental Services
                    </span>

                    <h2 className="mt-6 text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                        World-Class Dental Care
                        <span className="block text-cyan-600">
                            For Healthier, Brighter Smiles
                        </span>
                    </h2>

                    <p className="mt-6 text-xl text-slate-600 leading-8 max-w-3xl mx-auto">
                        From dental implants to smile makeovers, our specialists combine
                        advanced technology with personalized care to deliver exceptional
                        outcomes.
                    </p>

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group bg-gradient-to-b from-white to-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >

                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-3xl mb-6">
                                {service.icon}
                            </div>

                            <h3 className="text-xl font-semibold text-slate-900">
                                {service.title}
                            </h3>

                            <p className="mt-4 text-slate-600 leading-7">
                                {service.description}
                            </p>

                            <button className="mt-6 text-cyan-600 font-semibold group-hover:translate-x-1 transition">
                                Explore Treatment →
                            </button>

                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}