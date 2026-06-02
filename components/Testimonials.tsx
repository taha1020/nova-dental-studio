export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Dental Implant Patient",
      review:
        "The entire experience was exceptional. The team explained everything clearly and my implant results exceeded expectations.",
    },
    {
      name: "Michael Roberts",
      role: "Teeth Whitening Patient",
      review:
        "Professional staff, modern technology, and amazing results. My smile has never looked better.",
    },
    {
      name: "Emma Wilson",
      role: "Cosmetic Dentistry Patient",
      review:
        "From consultation to treatment, every step felt premium. I finally have the smile I always wanted.",
    },
  ];

  return (
    <section className="py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-3xl mx-auto text-center">

          <span className="inline-flex items-center bg-cyan-50 border border-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
            Patient Reviews
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            Trusted By
            <span className="block text-cyan-600">
              Thousands Of Patients
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Real experiences from patients who trusted us with
            their smiles.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
            >

              <div className="flex mb-6 text-yellow-400 text-xl">
                ★★★★★
              </div>

              <p className="text-slate-600 leading-8">
                "{item.review}"
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100">

                <h4 className="font-semibold text-slate-900">
                  {item.name}
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  {item.role}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}