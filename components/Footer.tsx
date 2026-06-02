export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-16">

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h3 className="font-bold text-xl">
              Nova Dental
            </h3>

            <p className="mt-4 text-slate-400">
              Premium dentistry powered by modern technology.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">
              Services
            </h4>

            <ul className="mt-4 space-y-2 text-slate-400">
              <li>Dental Implants</li>
              <li>Whitening</li>
              <li>Orthodontics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">
              Contact
            </h4>

            <ul className="mt-4 space-y-2 text-slate-400">
              <li>+1 (555) 123-4567</li>
              <li>hello@novadental.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">
              Address
            </h4>

            <p className="mt-4 text-slate-400">
              123 Dental Avenue
              <br />
              New York, NY
            </p>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-slate-500 text-sm">
          © 2026 Nova Dental. All rights reserved.
        </div>

      </div>

    </footer>
  );
}