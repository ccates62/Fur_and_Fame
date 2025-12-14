"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Service {
  name: string;
  icon: string;
  category: "database" | "ai" | "payment" | "fulfillment" | "email" | "hosting" | "development";
  status: "complete" | "pending" | "expired";
  signUpUrl: string;
  dashboardUrl: string;
  docsUrl: string;
  keys: { name: string; value: string; found: boolean }[];
  cost: string;
  usage?: {
    current: number;
    limit: number;
    unit: string;
    percentage: number;
  };
  details?: {
    description: string;
    features: string[];
    useCase: string;
  };
}

const allServices: Service[] = [
  // DATABASE SERVICES
  {
    name: "Supabase",
    icon: "🔐",
    category: "database",
    status: "complete",
    signUpUrl: "https://supabase.com/dashboard/sign-up",
    dashboardUrl: "https://supabase.com/dashboard",
    docsUrl: "https://supabase.com/docs",
    keys: [
      {
        name: "NEXT_PUBLIC_SUPABASE_URL",
        value: "https://kanhbrdiagogexsyfkkl.supabase.co",
        found: true,
      },
      {
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NzQ1MzksImV4cCI6MjA4MDU1MDUzOX0.Pv7oWQCSixo_nQFuQqdOqXfvju938rP_4NB5CD7hLZI",
        found: true,
      },
      {
        name: "SUPABASE_SERVICE_ROLE_KEY",
        value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbmhicmRpYWdvZ2V4c3lma2tsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk3NDUzOSwiZXhwIjoyMDgwNTUwNTM5fQ.vlDfknuiahsOjoN006vMvPGCOUE1TX3nAGlY8zXIduk",
        found: true,
      },
    ],
    cost: "Free Tier (Current) | Pro: $25/month",
    details: {
      description: "Open-source Firebase alternative providing PostgreSQL database, authentication, storage, and real-time subscriptions.",
      features: [
        "PostgreSQL database (500MB free, 8GB Pro)",
        "User authentication & authorization",
        "File storage for pet photos (1GB free, 100GB Pro)",
        "Real-time subscriptions",
        "Auto-generated REST APIs",
        "Row Level Security (RLS)"
      ],
      useCase: "Stores user accounts, pet photos, orders, and handles authentication for the e-commerce platform."
    },
  },

  // AI SERVICES
  {
    name: "fal.ai",
    icon: "🤖",
    category: "ai",
    status: "complete",
    signUpUrl: "https://fal.ai/dashboard",
    dashboardUrl: "https://fal.ai/dashboard",
    docsUrl: "https://docs.fal.ai",
    keys: [
      { name: "FAL_API_KEY", value: "3c29bf78-1853-4485-9bfd-b02abf47b713:f6ab21b3c482877d0cfba50f534045a1", found: true },
    ],
    cost: "Pay-as-you-go (typically $0.01-$0.10 per image)",
    details: {
      description: "AI inference platform providing access to Flux Pro and other cutting-edge AI models for generating high-quality pet portraits.",
      features: [
        "Flux Pro model access",
        "High-resolution AI image generation (4K)",
        "Fast inference times",
        "Multiple style options",
        "API-first architecture",
        "Usage-based pricing"
      ],
      useCase: "Generates AI pet portraits from uploaded pet photos, creating artistic variations (Renaissance, modern, etc.) for customers to purchase."
    },
  },

  // PAYMENT SERVICES
  {
    name: "Stripe",
    icon: "💳",
    category: "payment",
    status: "complete",
    signUpUrl: "https://dashboard.stripe.com/register",
    dashboardUrl: "https://dashboard.stripe.com",
    docsUrl: "https://stripe.com/docs",
    keys: [
      { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", found: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY },
      { name: "STRIPE_SECRET_KEY", value: process.env.STRIPE_SECRET_KEY ? "***REDACTED***" : "", found: !!process.env.STRIPE_SECRET_KEY },
    ],
    cost: "2.9% + $0.30 per successful transaction (no monthly fee)",
    details: {
      description: "Payment processing platform handling credit card transactions, subscriptions, and secure checkout for customer purchases.",
      features: [
        "Secure payment processing",
        "Checkout integration",
        "Webhook support for order fulfillment",
        "Subscription management",
        "Fraud protection",
        "Multi-currency support"
      ],
      useCase: "Processes payments when customers purchase AI pet portraits on canvas, mugs, or bundles. Triggers Printful order creation via webhooks."
    },
  },

  // FULFILLMENT SERVICES
  {
    name: "Printful",
    icon: "📦",
    category: "fulfillment",
    status: "complete",
    signUpUrl: "https://www.printful.com/sign-up",
    dashboardUrl: "https://www.printful.com/dashboard",
    docsUrl: "https://developers.printful.com/",
    keys: [
      { name: "PRINTFUL_API_KEY", value: "BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc", found: true },
    ],
    cost: "Per-item pricing (Canvas 12x12: ~$15, 16x20: ~$25, Mug: ~$8) + shipping",
    details: {
      description: "Print-on-demand fulfillment service that prints and ships AI-generated pet portraits on canvas, mugs, and other products.",
      features: [
        "Print-on-demand fulfillment",
        "Canvas prints (12x12, 16x20)",
        "Mugs and other products",
        "Automatic shipping to customers",
        "Quality control",
        "Global shipping network"
      ],
      useCase: "Receives orders via API when customers purchase. Prints AI portraits on physical products and ships directly to customers, enabling 50%+ profit margins."
    },
  },

  // EMAIL SERVICES
  {
    name: "Resend",
    icon: "📧",
    category: "email",
    status: "complete",
    signUpUrl: "https://resend.com/signup",
    dashboardUrl: "https://resend.com/emails",
    docsUrl: "https://resend.com/docs",
    keys: [
      { name: "RESEND_API_KEY", value: "re_NwySnmb2_APFjvHxKTFxLbBZ9owWfgGcX", found: true },
    ],
    cost: "Free: 100 emails/day | Pro: $20/month for 50,000 emails",
    details: {
      description: "Developer-friendly email API for sending transactional emails, order confirmations, and customer communications.",
      features: [
        "Transactional email API",
        "Order confirmation emails",
        "Email templates",
        "High deliverability rates",
        "React email support",
        "Email analytics"
      ],
      useCase: "Sends order confirmations, shipping notifications, and thank-you emails to customers after they purchase pet portraits."
    },
  },

  // HOSTING SERVICES
  {
    name: "Vercel",
    icon: "🚀",
    category: "hosting",
    status: "complete",
    signUpUrl: "https://vercel.com/signup",
    dashboardUrl: "https://vercel.com/dashboard",
    docsUrl: "https://vercel.com/docs",
    keys: [],
    cost: "Hobby (Free) | Pro: $20/month",
    details: {
      description: "Cloud platform for deploying Next.js applications with automatic deployments, edge functions, and global CDN.",
      features: [
        "Automatic deployments from GitHub",
        "Global CDN",
        "Edge functions",
        "Environment variables",
        "Custom domains",
        "Analytics and monitoring"
      ],
      useCase: "Hosts the Fur & Fame Next.js application, automatically deploys on git push, and provides global CDN for fast page loads."
    },
  },
  {
    name: "GitHub",
    icon: "🐙",
    category: "hosting",
    status: "complete",
    signUpUrl: "https://github.com/signup",
    dashboardUrl: "https://github.com",
    docsUrl: "https://docs.github.com",
    keys: [],
    cost: "Free for public repos | Pro: $4/month for private repos",
    details: {
      description: "Version control and code hosting platform for managing project repositories, collaboration, and CI/CD.",
      features: [
        "Git version control",
        "Code hosting and collaboration",
        "Issue tracking",
        "Pull requests and code reviews",
        "GitHub Actions (CI/CD)",
        "Project management"
      ],
      useCase: "Stores all project code, enables version control, and triggers automatic deployments to Vercel when code is pushed."
    },
  },

  // DEVELOPMENT SERVICES
  {
    name: "Cursor Pro",
    icon: "⌨️",
    category: "development",
    status: "complete",
    signUpUrl: "https://cursor.sh",
    dashboardUrl: "https://cursor.sh",
    docsUrl: "https://docs.cursor.sh",
    keys: [],
    cost: "Pro Plan: $20/month",
    details: {
      description: "AI-powered code editor that uses advanced language models to help write, edit, and understand code faster.",
      features: [
        "AI code completion and suggestions",
        "Chat with codebase for understanding",
        "Multi-file editing capabilities",
        "Code refactoring assistance",
        "Bug detection and fixes",
        "Fast code generation"
      ],
      useCase: "Primary development tool for building the Fur & Fame platform, providing AI assistance for coding, debugging, and project management."
    },
  },
];

const categories = [
  { id: "all", name: "All Services", icon: "📋", color: "gray" },
  { id: "database", name: "Database", icon: "🔐", color: "blue" },
  { id: "ai", name: "AI Services", icon: "🤖", color: "purple" },
  { id: "payment", name: "Payment", icon: "💳", color: "green" },
  { id: "fulfillment", name: "Fulfillment", icon: "📦", color: "orange" },
  { id: "email", name: "Email", icon: "📧", color: "pink" },
  { id: "hosting", name: "Hosting", icon: "🚀", color: "amber" },
  { id: "development", name: "Development", icon: "⌨️", color: "indigo" },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [falUsage, setFalUsage] = useState({ balance: 0, monthUsage: 0 });
  const [supabaseUsage, setSupabaseUsage] = useState({ database: 0, storage: 0, bandwidth: 0 });

  // Load usage data from localStorage
  useEffect(() => {
    const falSaved = localStorage.getItem("falUsageData");
    if (falSaved) {
      try {
        const data = JSON.parse(falSaved);
        setFalUsage({ balance: data.balance || 0, monthUsage: data.monthUsage || 0 });
      } catch (e) {
        console.error("Error loading fal usage:", e);
      }
    }

    const supabaseSaved = localStorage.getItem("supabaseUsageData");
    if (supabaseSaved) {
      try {
        const data = JSON.parse(supabaseSaved);
        setSupabaseUsage({
          database: data.database || 0,
          storage: data.storage || 0,
          bandwidth: data.bandwidth || 0,
        });
      } catch (e) {
        console.error("Error loading Supabase usage:", e);
      }
    }
  }, []);

  // Add usage data to services
  const servicesWithUsage = allServices.map((service) => {
    if (service.name === "Supabase") {
      return {
        ...service,
        usage: {
          current: supabaseUsage.database,
          limit: 500,
          unit: "MB",
          percentage: (supabaseUsage.database / 500) * 100,
        },
      };
    }
    if (service.name === "fal.ai") {
      return {
        ...service,
        usage: {
          current: Math.round(falUsage.monthUsage * 10),
          limit: 100,
          unit: "images",
          percentage: (falUsage.monthUsage / 10) * 100,
        },
      };
    }
    return service;
  });

  const filteredServices =
    selectedCategory === "all"
      ? servicesWithUsage
      : servicesWithUsage.filter((s) => s.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "expired":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return "bg-gray-100";
    const colorMap: Record<string, string> = {
      gray: "bg-gray-100 border-gray-300",
      blue: "bg-blue-100 border-blue-300",
      purple: "bg-purple-100 border-purple-300",
      green: "bg-green-100 border-green-300",
      orange: "bg-orange-100 border-orange-300",
      pink: "bg-pink-100 border-pink-300",
      amber: "bg-amber-100 border-amber-300",
      indigo: "bg-indigo-100 border-indigo-300",
    };
    return colorMap[category.color] || "bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🔑 Services Catalog & Monitoring
              </h1>
              <p className="text-gray-600 text-lg">
                All your business services organized by category
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

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-2 border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category.id
                    ? "bg-amber-600 text-white shadow-lg"
                    : `${getCategoryColor(category.id)} text-gray-700 hover:shadow-md`
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                {selectedCategory === category.id && (
                  <span className="ml-2 text-xs">
                    ({filteredServices.length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Services by Category */}
        {categories
          .filter((cat) => cat.id !== "all")
          .map((category) => {
            const categoryServices = servicesWithUsage.filter(
              (s) => s.category === category.id
            );
            if (selectedCategory !== "all" && selectedCategory !== category.id) return null;
            if (categoryServices.length === 0) return null;

            return (
              <div key={category.id} className="mb-8">
                <div className={`${getCategoryColor(category.id)} rounded-lg p-4 mb-4 border-2`}>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.name} Services
                    <span className="text-lg font-normal text-gray-600">
                      ({categoryServices.length})
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryServices.map((service, index) => (
                    <div
                      key={service.name}
                      className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:shadow-lg transition"
                    >
                      {/* Service Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{service.icon}</span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {service.name}
                            </h3>
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                                service.status
                              )}`}
                            >
                              {service.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Usage Display */}
                      {service.usage && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Usage</span>
                            <span className="text-sm font-bold text-gray-900">
                              {service.usage.current} / {service.usage.limit} {service.usage.unit}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                service.usage.percentage >= 80
                                  ? "bg-red-500"
                                  : service.usage.percentage >= 60
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(service.usage.percentage, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {service.usage.percentage.toFixed(1)}% of limit
                          </p>
                        </div>
                      )}

                      {/* Cost */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Cost</p>
                        <p className="text-sm font-semibold text-gray-900">{service.cost}</p>
                      </div>

                      {/* API Keys Status */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">API Keys</p>
                        <div className="space-y-1">
                          {service.keys.length > 0 ? (
                            service.keys.map((key, keyIndex) => (
                              <div
                                key={keyIndex}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-700 truncate">{key.name}</span>
                                <span
                                  className={`px-2 py-1 rounded ${
                                    key.found
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {key.found ? "✓" : "✗"}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No API keys required</p>
                          )}
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="flex gap-2 mb-4">
                        <a
                          href={service.dashboardUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center px-3 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Dashboard
                        </a>
                        <a
                          href={service.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center px-3 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          Docs
                        </a>
                      </div>
                      {/* Auto-Push Script Link for Vercel */}
                      {service.name === "Vercel" && (
                        <div className="mb-4 pt-3 border-t border-gray-200">
                          <a
                            href="/auto-push.bat"
                            download="auto-push.bat"
                            className="w-full bg-green-600 hover:bg-green-700 text-white text-center px-3 py-2 rounded-lg text-sm font-semibold transition block mb-2"
                          >
                            📤 Download Auto-Push Script
                          </a>
                          <p className="text-xs text-gray-500 text-center">
                            Double-click to push code to GitHub & trigger Vercel deployment
                          </p>
                        </div>
                      )}

                      {/* Expand Details */}
                      <button
                        onClick={() =>
                          setExpandedService(expandedService === index ? null : index)
                        }
                        className="w-full text-sm text-amber-600 hover:text-amber-700 font-semibold"
                      >
                        {expandedService === index ? "▼ Hide Details" : "▶ Show Details"}
                      </button>

                      {/* Expanded Details */}
                      {expandedService === index && service.details && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-700 mb-3">
                            {service.details.description}
                          </p>
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Features:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                              {service.details.features.map((feature, fIndex) => (
                                <li key={fIndex}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">Use Case:</p>
                            <p className="text-xs text-gray-600">{service.details.useCase}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        {/* Summary Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {servicesWithUsage.filter((s) => s.status === "complete").length}
              </p>
              <p className="text-sm text-gray-600">Active Services</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {servicesWithUsage.filter((s) => s.keys.length > 0 && s.keys.every((k) => k.found)).length}
              </p>
              <p className="text-sm text-gray-600">Configured APIs</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-3xl font-bold text-amber-600">
                {categories.filter((c) => c.id !== "all").length}
              </p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{allServices.length}</p>
              <p className="text-sm text-gray-600">Total Services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
