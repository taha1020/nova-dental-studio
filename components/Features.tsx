export default function Features() {
  const features = [
    {
      title: "AI Appointment Booking",
      description:
        "Patients can schedule appointments instantly through AI conversations without calling your clinic.",
      icon: "📅",
    },
    {
      title: "24/7 Patient Support",
      description:
        "Answer treatment questions, pricing inquiries, and patient concerns at any time.",
      icon: "🤖",
    },
    {
      title: "Automated Reminders",
      description:
        "Reduce no-shows with intelligent email and SMS appointment reminders.",
      icon: "📧",
    },
    {
      title: "Lead Qualification",
      description:
        "Capture and qualify new patient inquiries before they reach your front desk.",
      icon: "🎯",
    },
    {
      title: "Treatment Guidance",
      description:
        "Explain procedures and help patients understand treatment options.",
      icon: "🦷",
    },
    {
      title: "Clinic Dashboard",
      description:
        "Monitor appointments, leads, and performance from one centralized dashboard.",
      icon: "📊",
    },
  ];

  return (
    <section
      id="features"
      className="py-32 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-3xl mx-auto text-center">

          <span className="inline-flex bg-cyan-50 border border-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
            Powerful Features
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
            Everything Your Dental Practice
            <span className="block text-cyan-600">
              Needs To Grow Faster
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Nova AI replaces repetitive front-desk tasks so your team can focus
            on delivering exceptional patient care.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-20">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >

              <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-2xl mb-6">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-slate-600 leading-7">
                {feature.description}
              </p>

            </div>
          ))}
        </div>

        <div className="mt-20 bg-white border border-slate-200 rounded-3xl p-8 grid md:grid-cols-4 gap-8 text-center">

          <div>
            <h3 className="text-3xl font-bold text-slate-900">10K+</h3>
            <p className="text-slate-500 mt-2">Patient Conversations</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-slate-900">92%</h3>
            <p className="text-slate-500 mt-2">Booking Conversion</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-slate-900">24/7</h3>
            <p className="text-slate-500 mt-2">AI Availability</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-slate-900">40%</h3>
            <p className="text-slate-500 mt-2">Fewer No-Shows</p>
          </div>

        </div>

      </div>
    </section>
  );
}