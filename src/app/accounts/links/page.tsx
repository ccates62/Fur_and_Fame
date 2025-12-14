"use client";

import Link from "next/link";

// Get base URL for client-side use
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use current origin or env variable
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }
  // Server-side fallback
  return process.env.NEXT_PUBLIC_BASE_URL || "https://www.furandfame.com";
}

interface BusinessLink {
  name: string;
  url: string;
  description: string;
  category: "critical" | "important" | "reference";
  icon: string;
}

const businessLinks: BusinessLink[] = [
  // CRITICAL - Daily/Weekly Use
  {
    name: "Fur & Fame Website",
    url: getBaseUrl(),
    description: "Your live production website - check orders, test features",
    category: "critical",
    icon: "🌐",
  },
  {
    name: "Vercel Dashboard",
    url: "https://vercel.com/dashboard",
    description: "Deployments, environment variables, domain settings",
    category: "critical",
    icon: "🚀",
  },
  {
    name: "Stripe Dashboard",
    url: "https://dashboard.stripe.com",
    description: "View payments, customers, products, webhooks",
    category: "critical",
    icon: "💳",
  },
  {
    name: "Printful Dashboard",
    url: "https://www.printful.com/dashboard",
    description: "Orders, products, shipping, inventory management",
    category: "critical",
    icon: "📦",
  },
  {
    name: "GitHub Repository",
    url: "https://github.com/ccates62/Fur_and_Fame",
    description: "Code repository, commits, deployments",
    category: "critical",
    icon: "🐙",
  },
  {
    name: "Gmail - Business Email",
    url: "https://mail.google.com/mail/u/?authuser=ccates.timberlinecollective@gmail.com",
    description: "Primary business email for customer communications",
    category: "critical",
    icon: "📧",
  },
  {
    name: "Gmail - Old Email (Reference)",
    url: "https://mail.google.com/mail/u/?authuser=ccates.timberlinecolletive@gmail.com",
    description: "Old misspelled email - kept for reference only",
    category: "reference",
    icon: "📧",
  },

  // IMPORTANT - Regular Use
  {
    name: "Supabase Dashboard",
    url: "https://supabase.com/dashboard",
    description: "Database, storage, authentication, API keys",
    category: "important",
    icon: "🔐",
  },
  {
    name: "fal.ai Dashboard",
    url: "https://fal.ai/dashboard",
    description: "AI generation credits, API usage, billing",
    category: "important",
    icon: "🤖",
  },
  {
    name: "Resend Dashboard",
    url: "https://resend.com/emails",
    description: "Email logs, API keys, domain verification",
    category: "important",
    icon: "📨",
  },
  {
    name: "Stripe Test Mode",
    url: "https://dashboard.stripe.com/test",
    description: "Test payments, webhooks, customer data",
    category: "important",
    icon: "🧪",
  },
  {
    name: "Printful Store Settings",
    url: "https://www.printful.com/dashboard/stores",
    description: "Store configuration, shipping, tax settings",
    category: "important",
    icon: "⚙️",
  },
  {
    name: "Vercel Project Settings",
    url: "https://vercel.com/dashboard",
    description: "Environment variables, domains, build settings",
    category: "important",
    icon: "🔧",
  },
  {
    name: "Mercury Bank Login",
    url: "https://mercury.com",
    description: "Business bank account - view balance, transactions, statements",
    category: "important",
    icon: "🏦",
  },
  {
    name: "Wave Accounting Dashboard",
    url: "https://next.waveapps.com/f1e34b2d-eb8b-44a8-a8fa-1e110990d88b/dashboard",
    description: "Free accounting software - track income, expenses, invoices, and financial reports",
    category: "important",
    icon: "📊",
  },

  // REFERENCE - Occasional Use
  {
    name: "Oregon Secretary of State",
    url: "https://sos.oregon.gov/business/Pages/business-search.aspx",
    description: "Check LLC status, update business information",
    category: "reference",
    icon: "🏛️",
  },
  {
    name: "Stripe Documentation",
    url: "https://stripe.com/docs",
    description: "API reference, webhooks, payment methods",
    category: "reference",
    icon: "📚",
  },
  {
    name: "Printful API Docs",
    url: "https://developers.printful.com",
    description: "API integration, webhooks, product catalog",
    category: "reference",
    icon: "📖",
  },
  {
    name: "fal.ai Documentation",
    url: "https://docs.fal.ai",
    description: "AI model guides, API reference, examples",
    category: "reference",
    icon: "🤖",
  },
  {
    name: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "Framework docs, API routes, deployment",
    category: "reference",
    icon: "⚡",
  },
  {
    name: "Supabase Documentation",
    url: "https://supabase.com/docs",
    description: "Database guides, auth setup, storage",
    category: "reference",
    icon: "🔐",
  },
  {
    name: "Vercel Documentation",
    url: "https://vercel.com/docs",
    description: "Deployment guides, environment variables",
    category: "reference",
    icon: "🚀",
  },
  {
    name: "Resend Documentation",
    url: "https://resend.com/docs",
    description: "Email API, templates, domain setup",
    category: "reference",
    icon: "📨",
  },
  {
    name: "TikTok Ads Manager",
    url: "https://ads.tiktok.com",
    description: "Create and manage TikTok ad campaigns",
    category: "reference",
    icon: "📱",
  },
  {
    name: "Facebook Ads Manager",
    url: "https://business.facebook.com/adsmanager",
    description: "Create and manage Facebook/Instagram ads",
    category: "reference",
    icon: "📘",
  },
  {
    name: "Google Analytics",
    url: "https://analytics.google.com",
    description: "Website traffic, user behavior, conversions",
    category: "reference",
    icon: "📊",
  },
  {
    name: "Namecheap Domain",
    url: "https://www.namecheap.com/myaccount/login",
    description: "Domain management, DNS settings for FurAndFame.com",
    category: "reference",
    icon: "🌍",
  },
];

export default function BusinessLinksPage() {
  const criticalLinks = businessLinks.filter((l) => l.category === "critical");
  const importantLinks = businessLinks.filter((l) => l.category === "important");
  const referenceLinks = businessLinks.filter((l) => l.category === "reference");

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🔗 Business Links & Resources
              </h1>
              <p className="text-gray-600 text-lg">
                Quick access to all your business tools and services
              </p>
            </div>
            <Link
              href="/accounts"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Critical Links */}
        <div className="mb-8">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              🔴 Critical - Daily/Weekly Use
            </h2>
            <p className="text-red-700 mb-4">
              These are your most frequently used links - bookmark these!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {criticalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 border-2 border-red-200 hover:border-red-400 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-3xl">{link.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-red-600 group-hover:underline mb-1">
                        {link.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span className="truncate">{link.url}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Important Links */}
        <div className="mb-8">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-amber-900 mb-2">
              🟡 Important - Regular Use
            </h2>
            <p className="text-amber-700 mb-4">
              Links you&apos;ll use regularly for managing your business
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {importantLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-3xl">{link.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 group-hover:underline mb-1">
                        {link.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span className="truncate">{link.url}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Reference Links */}
        <div className="mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              🔵 Reference - Occasional Use
            </h2>
            <p className="text-blue-700 mb-4">
              Documentation, guides, and tools you&apos;ll need occasionally
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {referenceLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow-md p-5 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-3xl">{link.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 group-hover:underline mb-1">
                        {link.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {link.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span className="truncate">{link.url}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{criticalLinks.length}</p>
              <p className="text-sm text-gray-600">Critical Links</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-3xl font-bold text-amber-600">{importantLinks.length}</p>
              <p className="text-sm text-gray-600">Important Links</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{referenceLinks.length}</p>
              <p className="text-sm text-gray-600">Reference Links</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
