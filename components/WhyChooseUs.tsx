export default function WhyChooseUs() {
  const reasons = [
    {
      title: "15+ Years Experience",
      description:
        "Trusted by thousands of patients for advanced and cosmetic dentistry.",
    },
    {
      title: "4.9★ Patient Rating",
      description:
        "Exceptional patient satisfaction backed by verified reviews.",
    },
    {
      title: "Modern Technology",
      description:
        "Digital diagnostics, 3D imaging, and advanced treatment planning.",
    },
    {
      title: "Same-Day Emergency Care",
      description:
        "Fast access to urgent dental treatment when you need it most.",
    },
  ];

  return (
    <section className="py-28 bg-[#081028]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-3xl mx-auto text-center">

          <span className="inline-flex bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
            Why Choose Nova Dental
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Trusted By Families,
            <span className="block text-cyan-400">
              Professionals & Patients
            </span>
          </h2>

          <p className="mt-6 text-slate-400 text-lg leading-8">
            We combine clinical excellence, modern technology, and
            personalized care to deliver exceptional dental experiences.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">

          {reasons.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-cyan-500/30 transition"
            >

              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              </div>

              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-7">
                {item.description}
              </p>

            </div>
          ))}
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-8 mt-20 text-center">

          <div>
            <h3 className="text-5xl font-bold text-white">10K+</h3>
            <p className="mt-2 text-slate-400">
              Happy Patients
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-white">15+</h3>
            <p className="mt-2 text-slate-400">
              Years Experience
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-white">4.9★</h3>
            <p className="mt-2 text-slate-400">
              Average Rating
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-white">24/7</h3>
            <p className="mt-2 text-slate-400">
              Emergency Support
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}