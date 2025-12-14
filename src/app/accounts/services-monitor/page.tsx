"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceMonitor {
  name: string;
  icon: string;
  category: "database" | "ai" | "payment" | "fulfillment" | "email" | "hosting" | "development";
  status: "active" | "pending" | "expired";
  cost: number;
  usage: {
    current: number;
    limit: number;
    unit: string;
    percentage: number;
  };
  apiKeys: {
    name: string;
    found: boolean;
  }[];
  dashboardUrl: string;
  lastUpdated?: string;
  alerts?: string[];
}

export default function ServicesMonitorPage() {
  const [services, setServices] = useState<ServiceMonitor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [falUsage, setFalUsage] = useState({
    balance: 0,
    todayUsage: 0,
    monthUsage: 0,
    dailyUsage: [0, 0, 0, 0, 0, 0, 0],
  });
  const [supabaseUsage, setSupabaseUsage] = useState({
    database: 0,
    storage: 0,
    bandwidth: 0,
  });

  // Load usage data from localStorage
  useEffect(() => {
    const falSaved = localStorage.getItem("falUsageData");
    if (falSaved) {
      try {
        const data = JSON.parse(falSaved);
        setFalUsage({
          balance: data.balance || 0,
          todayUsage: data.todayUsage || 0,
          monthUsage: data.monthUsage || 0,
          dailyUsage: data.dailyUsage || [0, 0, 0, 0, 0, 0, 0],
        });
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

  // Initialize services with real data
  useEffect(() => {
    const allServices: ServiceMonitor[] = [
      // Database Services
      {
        name: "Supabase",
        icon: "🔐",
        category: "database",
        status: "active",
        cost: 0,
        usage: {
          current: supabaseUsage.database,
          limit: 500,
          unit: "MB",
          percentage: (supabaseUsage.database / 500) * 100,
        },
        apiKeys: [
          { name: "NEXT_PUBLIC_SUPABASE_URL", found: true },
          { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", found: true },
          { name: "SUPABASE_SERVICE_ROLE_KEY", found: true },
        ],
        dashboardUrl: "https://supabase.com/dashboard",
        alerts: supabaseUsage.database > 400 ? ["Database approaching limit"] : undefined,
      },
      {
        name: "Supabase Storage",
        icon: "📦",
        category: "database",
        status: "active",
        cost: 0,
        usage: {
          current: supabaseUsage.storage,
          limit: 1024,
          unit: "MB",
          percentage: (supabaseUsage.storage / 1024) * 100,
        },
        apiKeys: [],
        dashboardUrl: "https://supabase.com/dashboard/storage",
        alerts: supabaseUsage.storage > 800 ? ["Storage approaching limit"] : undefined,
      },
      {
        name: "Supabase Bandwidth",
        icon: "🌐",
        category: "database",
        status: "active",
        cost: 0,
        usage: {
          current: supabaseUsage.bandwidth,
          limit: 2,
          unit: "GB",
          percentage: (supabaseUsage.bandwidth / 2) * 100,
        },
        apiKeys: [],
        dashboardUrl: "https://supabase.com/dashboard",
        alerts: supabaseUsage.bandwidth > 1.6 ? ["Bandwidth approaching limit"] : undefined,
      },

      // AI Services
      {
        name: "fal.ai",
        icon: "🤖",
        category: "ai",
        status: "active",
        cost: falUsage.monthUsage,
        usage: {
          current: Math.round(falUsage.monthUsage * 10),
          limit: 100,
          unit: "images/month",
          percentage: (falUsage.monthUsage / 10) * 100,
        },
        apiKeys: [{ name: "FAL_API_KEY", found: true }],
        dashboardUrl: "https://fal.ai/dashboard",
        alerts: falUsage.balance < 5 ? ["Low balance - consider adding credits"] : undefined,
      },

      // Payment Services
      {
        name: "Stripe",
        icon: "💳",
        category: "payment",
        status: "active",
        cost: 0,
        usage: {
          current: 0,
          limit: 0,
          unit: "transactions",
          percentage: 0,
        },
        apiKeys: [
          { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", found: true },
          { name: "STRIPE_SECRET_KEY", found: true },
        ],
        dashboardUrl: "https://dashboard.stripe.com",
      },

      // Fulfillment Services
      {
        name: "Printful",
        icon: "🎨",
        category: "fulfillment",
        status: "active",
        cost: 0,
        usage: {
          current: 0,
          limit: 0,
          unit: "orders",
          percentage: 0,
        },
        apiKeys: [{ name: "PRINTFUL_API_KEY", found: true }],
        dashboardUrl: "https://www.printful.com/dashboard",
      },

      // Email Services
      {
        name: "Resend",
        icon: "📧",
        category: "email",
        status: "active",
        cost: 0,
        usage: {
          current: 12,
          limit: 100,
          unit: "emails/day",
          percentage: 12,
        },
        apiKeys: [{ name: "RESEND_API_KEY", found: true }],
        dashboardUrl: "https://resend.com/emails",
      },

      // Hosting Services
      {
        name: "Vercel",
        icon: "🚀",
        category: "hosting",
        status: "active",
        cost: 0,
        usage: {
          current: supabaseUsage.bandwidth,
          limit: 100,
          unit: "GB bandwidth",
          percentage: (supabaseUsage.bandwidth / 100) * 100,
        },
        apiKeys: [],
        dashboardUrl: "https://vercel.com/dashboard",
      },
      {
        name: "GitHub",
        icon: "🐙",
        category: "hosting",
        status: "active",
        cost: 0,
        usage: {
          current: 0,
          limit: 0,
          unit: "repos",
          percentage: 0,
        },
        apiKeys: [],
        dashboardUrl: "https://github.com",
      },

      // Development Services
      {
        name: "Cursor Pro",
        icon: "⌨️",
        category: "development",
        status: "active",
        cost: 20,
        usage: {
          current: 1,
          limit: 1,
          unit: "subscription",
          percentage: 100,
        },
        apiKeys: [],
        dashboardUrl: "https://cursor.sh",
      },
    ];

    setServices(allServices);
  }, [falUsage, supabaseUsage]);

  const categories = [
    { id: "all", name: "All Services", icon: "📋" },
    { id: "database", name: "Database", icon: "🔐" },
    { id: "ai", name: "AI Services", icon: "🤖" },
    { id: "payment", name: "Payment", icon: "💳" },
    { id: "fulfillment", name: "Fulfillment", icon: "📦" },
    { id: "email", name: "Email", icon: "📧" },
    { id: "hosting", name: "Hosting", icon: "🚀" },
    { id: "development", name: "Development", icon: "⌨️" },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "expired":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 60) return "bg-amber-500";
    return "bg-green-500";
  };

  const totalCost = services.reduce((sum, s) => sum + s.cost, 0);
  const activeServices = services.filter((s) => s.status === "active").length;
  const servicesWithAlerts = services.filter((s) => s.alerts && s.alerts.length > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                📊 Service Monitoring Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Monitor all your services in one place - usage, costs, and status
              </p>
            </div>
            <Link
              href="/accounts"
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-2 border-green-200">
              <p className="text-sm text-gray-600 mb-1">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-2 border-amber-200">
              <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
              <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-2 border-red-200">
              <p className="text-sm text-gray-600 mb-1">Services with Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{servicesWithAlerts}</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.name}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:shadow-lg transition"
            >
              {/* Service Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{service.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status}
                    </span>
                  </div>
                </div>
                <a
                  href={service.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-600 transition"
                  title="Open Dashboard"
                >
                  <svg
                    className="w-5 h-5"
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
                </a>
              </div>

              {/* Cost */}
              {service.cost > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Monthly Cost</p>
                  <p className="text-xl font-bold text-amber-600">${service.cost.toFixed(2)}</p>
                </div>
              )}

              {/* Usage */}
              {service.usage.limit > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">Usage</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {service.usage.current} / {service.usage.limit} {service.usage.unit}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getUsageColor(
                        service.usage.percentage
                      )}`}
                      style={{ width: `${Math.min(service.usage.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {service.usage.percentage.toFixed(1)}% used
                  </p>
                </div>
              )}

              {/* API Keys Status */}
              {service.apiKeys.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">API Keys</p>
                  <div className="space-y-1">
                    {service.apiKeys.map((key, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            key.found ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        <span className="text-gray-700 font-mono">{key.name}</span>
                        <span
                          className={`ml-auto ${
                            key.found ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {key.found ? "✓" : "✗"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alerts */}
              {service.alerts && service.alerts.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-800 mb-1">⚠️ Alerts</p>
                  {service.alerts.map((alert, idx) => (
                    <p key={idx} className="text-xs text-red-700">
                      • {alert}
                    </p>
                  ))}
                </div>
              )}

              {/* Category Badge */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {service.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-gray-200">
            <p className="text-gray-600 text-lg">No services found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

