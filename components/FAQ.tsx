export default function FAQ() {
  const faqs = [
    {
      q: "Do you accept emergency appointments?",
      a: "Yes. We offer same-day emergency dental care whenever possible.",
    },
    {
      q: "Can I book online?",
      a: "Absolutely. Patients can book appointments through Nova AI in seconds.",
    },
    {
      q: "Do you offer dental implants?",
      a: "Yes. We provide complete implant consultation and treatment services.",
    },
    {
      q: "Do you accept insurance?",
      a: "We work with most major insurance providers and offer flexible payment options.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center">

          <span className="inline-flex bg-cyan-50 border border-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-slate-900">
            Everything You Need To Know
          </h2>

        </div>

        <div className="mt-16 space-y-6">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-slate-900">
                {faq.q}
              </h3>

              <p className="mt-3 text-slate-600">
                {faq.a}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}