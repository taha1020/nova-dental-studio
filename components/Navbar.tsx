export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 pt-6">

        <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl px-6 h-20 flex items-center justify-between shadow-sm">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-bold">
              N
            </div>

            <div>
              <h1 className="font-bold text-lg leading-none text-slate-900">
                Nova AI
              </h1>

              <p className="text-xs text-slate-500 mt-1">
                Dental Receptionist
              </p>
            </div>

          </div>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-10">

            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </a>

            <a
              href="#pricing"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </a>

            <a
              href="#faq"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </a>

          </div>

          {/* CTA */}
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all">
            Book Demo
          </button>

        </div>

      </div>
    </nav>
  );
}