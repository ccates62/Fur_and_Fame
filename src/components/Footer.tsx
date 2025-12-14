"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-amber-400">🐾</span>
              <span className="text-xl font-bold text-white">Fur & Fame</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Transform your pet into a masterpiece with AI-powered portraits. 
              Choose from multiple artistic styles and create stunning portraits 
              that celebrate your furry friend.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} Timberline Collective LLC. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-amber-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-amber-400 transition">
                  Create Portrait
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>
            Fur and Fame is a service of{" "}
            <span className="text-gray-400">Timberline Collective LLC</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
