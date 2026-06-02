export default function MeetTheDoctors() {
  const doctors = [
    {
      name: "Dr. Michael Anderson",
      role: "Lead Implant Specialist",
      experience: "15+ Years Experience",
      icon: "👨‍⚕️",
    },
    {
      name: "Dr. Sarah Williams",
      role: "Cosmetic Dentist",
      experience: "12+ Years Experience",
      icon: "👩‍⚕️",
    },
    {
      name: "Dr. James Cooper",
      role: "Orthodontics Specialist",
      experience: "10+ Years Experience",
      icon: "👨‍⚕️",
    },
  ];

  return (
    <section className="relative py-28 bg-[#081028] overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center">

          <span className="inline-flex items-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
            Meet Our Experts
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            World-Class Dentists
            <span className="block text-cyan-400">
              Dedicated To Your Smile
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-400 leading-8">
            Our highly experienced dental specialists combine
            advanced technology, precision treatment, and
            compassionate care to deliver exceptional outcomes.
          </p>

        </div>

        {/* Doctors Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {doctors.map((doctor, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/30 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-2"
            >

              {/* Image Placeholder */}
              <div className="aspect-[4/5] bg-gradient-to-br from-cyan-500/10 to-white/5 flex items-center justify-center">

                <div className="w-28 h-28 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-5xl backdrop-blur-sm">
                  {doctor.icon}
                </div>

              </div>

              {/* Content */}
              <div className="p-8">

                <h3 className="text-2xl font-semibold text-white">
                  {doctor.name}
                </h3>

                <p className="mt-2 text-cyan-400 font-medium">
                  {doctor.role}
                </p>

                <p className="mt-4 text-slate-400">
                  {doctor.experience}
                </p>

              </div>

            </div>
          ))}

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mt-24 text-center">

          <div>
            <h3 className="text-5xl font-bold text-white">
              10K+
            </h3>

            <p className="mt-3 text-slate-400">
              Happy Patients
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-white">
              15+
            </h3>

            <p className="mt-3 text-slate-400">
              Years Experience
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-white">
              4.9★
            </h3>

            <p className="mt-3 text-slate-400">
              Average Rating
            </p>
          </div>

          <div>
            <h3 className="text-5xl font-bold text-white">
              24/7
            </h3>

            <p className="mt-3 text-slate-400">
              Emergency Support
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}