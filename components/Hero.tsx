export default function Hero() {
  return (
    <section className="h-screen bg-white flex items-center pt-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>

            <div className="inline-flex items-center bg-cyan-50 border border-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium">
              AI Receptionist Built For Modern Dental Practices
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Never Miss Another
              <span className="block text-cyan-600">
                Dental Appointment
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-8 max-w-xl">
              Convert more visitors into patients with an AI receptionist
              that answers questions, books appointments, sends reminders,
              and supports your clinic 24/7.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">

              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                Book Free Demo
              </button>

              <button className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold transition">
                See Live Demo
              </button>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-6 border-t border-slate-200">

              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  24/7
                </h3>

                <p className="text-slate-500 mt-1 text-sm">
                  AI Support
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  92%
                </h3>

                <p className="text-slate-500 mt-1 text-sm">
                  Booking Rate
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-900">
                  15K+
                </h3>

                <p className="text-slate-500 mt-1 text-sm">
                  Conversations
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b">

                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    Nova AI Receptionist
                  </h3>

                  <p className="text-sm text-slate-500">
                    Online • Ready To Help
                  </p>
                </div>

                <div className="w-3 h-3 bg-green-500 rounded-full"></div>

              </div>

              {/* Conversation */}
              <div className="p-5 space-y-3">

                <div className="bg-slate-100 rounded-2xl p-3 text-slate-700">
                  👤 I need dental implants.
                </div>

                <div className="bg-cyan-50 rounded-2xl p-3 text-slate-800">
                  🤖 I'd be happy to help. Would you like a free consultation?
                </div>

                <div className="bg-slate-100 rounded-2xl p-3 text-slate-700">
                  👤 Yes, please.
                </div>

                <div className="bg-cyan-50 rounded-2xl p-3 text-slate-800">
                  🤖 Great. Thursday at 3:00 PM is available.
                </div>

              </div>

              {/* Bottom Metrics */}
              <div className="border-t p-5">

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h4 className="text-2xl font-bold text-slate-900">
                      34
                    </h4>

                    <p className="text-sm text-slate-500">
                      Bookings
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h4 className="text-2xl font-bold text-slate-900">
                      92%
                    </h4>

                    <p className="text-sm text-slate-500">
                      Conversion
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}