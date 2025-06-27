import { Pizza } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Pizza className="w-8 h-8 text-rose-500" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                Neurodoc
              </span>
            </div>
            <p className="text-gray-600">
              AI-powered document intelligence that transforms your PDFs into actionable knowledge.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#how-it-works"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-rose-500 transition"
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Neurodoc AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cookie Policy
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              GDPR
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}