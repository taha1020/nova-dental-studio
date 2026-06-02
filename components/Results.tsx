export default function Results() {
  const results = [
    {
      treatment: "Teeth Whitening",
    },
    {
      treatment: "Dental Veneers",
    },
    {
      treatment: "Dental Implants",
    },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-3xl mx-auto text-center">

          <span className="inline-flex bg-cyan-50 border border-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
            Patient Transformations
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
            Real Results.
            <span className="block text-cyan-600">
              Real Confidence.
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            See how our advanced dental treatments help patients
            achieve healthier and more confident smiles.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {results.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >

              <div className="grid grid-cols-2">

                <div className="aspect-square bg-slate-100 flex items-center justify-center text-slate-400">
                  Before
                </div>

                <div className="aspect-square bg-cyan-50 flex items-center justify-center text-cyan-600 font-medium">
                  After
                </div>

              </div>

              <div className="p-6">

                <h3 className="text-xl font-semibold text-slate-900">
                  {item.treatment}
                </h3>

                <p className="mt-3 text-slate-600">
                  Professional treatment performed by experienced dental specialists.
                </p>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}