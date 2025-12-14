"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase-client";
import Link from "next/link";
import Script from "next/script";
import ProgressTracker from "@/components/ProgressTracker";
import BreedNotification from "@/components/BreedNotification";

// Access environment variables lazily to avoid build-time errors
const getOwnerEmail = () => process.env.NEXT_PUBLIC_OWNER_EMAIL || "";

interface Service {
  name: string;
  icon: string;
  status: "complete" | "pending";
  signUpUrl: string;
  dashboardUrl: string;
  docsUrl: string;
  keys: { name: string; value: string; found: boolean }[];
  details?: {
    description: string;
    cost: string;
    features: string[];
    useCase: string;
  };
}

interface Payment {
  service: string;
  plan: string;
  amount: number;
  frequency: "monthly" | "yearly" | "one-time";
  nextDue: string;
  status: "active" | "expired" | "pending";
  notes?: string;
  expirationDate?: string;
}

interface GitHubProject {
  name: string;
  description: string;
  url: string;
  status: "active" | "archived" | "planning";
  lastUpdated: string;
  branch: string;
  language?: string;
}

interface TaxRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: "recurring" | "one-time" | "setup" | "equipment" | "software" | "other";
  service?: string;
  notes?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dateCompleted?: string;
  category: "legal" | "payment" | "setup" | "integration" | "marketing" | "other";
}

export default function AccountsDashboard() {
  const router = useRouter();
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [breedNotificationsEnabled, setBreedNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);

  // Sales tracking interface
  interface Sale {
    id: string;
    date: string;
    amount: number;
    product: string;
    customerEmail?: string;
    orderId?: string;
  }

  // All useState hooks must be at the top (before conditional returns)
  const [services] = useState<Service[]>([
    {
      name: "Supabase",
      icon: "🔐",
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
      details: {
        description: "Open-source Firebase alternative providing PostgreSQL database, authentication, storage, and real-time subscriptions.",
        cost: "Free Tier (Current) | Pro: $25/month",
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
    {
      name: "fal.ai",
      icon: "🤖",
      status: "complete",
      signUpUrl: "https://fal.ai/dashboard",
      dashboardUrl: "https://fal.ai/dashboard",
      docsUrl: "https://fal.ai/docs",
      keys: [
        { name: "FAL_API_KEY", value: "3c29bf78-1853-4485-9bfd-b02abf47b713:f6ab21b3c482877d0cfba50f534045a1", found: true },
      ],
      details: {
        description: "AI inference platform providing access to Flux Pro and other cutting-edge AI models for generating high-quality pet portraits.",
        cost: "Pay-as-you-go (typically $0.01-$0.10 per image)",
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
    {
      name: "Stripe",
      icon: "💳",
      status: "complete",
      signUpUrl: "https://dashboard.stripe.com/register",
      dashboardUrl: "https://dashboard.stripe.com",
      docsUrl: "https://stripe.com/docs",
      keys: [
        { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "", found: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY },
        { name: "STRIPE_SECRET_KEY", value: process.env.STRIPE_SECRET_KEY ? "***REDACTED***" : "", found: !!process.env.STRIPE_SECRET_KEY },
      ],
      details: {
        description: "Payment processing platform handling credit card transactions, subscriptions, and secure checkout for customer purchases.",
        cost: "2.9% + $0.30 per successful transaction (no monthly fee)",
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
    {
      name: "Printful",
      icon: "🎨",
      status: "complete",
      signUpUrl: "https://www.printful.com/sign-up",
      dashboardUrl: "https://www.printful.com/dashboard",
      docsUrl: "https://developers.printful.com/",
      keys: [
        { name: "PRINTFUL_API_KEY", value: "BHDDF5JNfcukUvV5DzgpwH52eWDk5tvwCPPFLLbc", found: true },
      ],
      details: {
        description: "Print-on-demand fulfillment service that prints and ships AI-generated pet portraits on canvas, mugs, and other products.",
        cost: "Per-item pricing (Canvas 12x12: ~$15, 16x20: ~$25, Mug: ~$8) + shipping",
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
    {
      name: "Resend",
      icon: "📧",
      status: "complete",
      signUpUrl: "https://resend.com/signup",
      dashboardUrl: "https://resend.com/emails",
      docsUrl: "https://resend.com/docs",
      keys: [
        { name: "RESEND_API_KEY", value: "re_NwySnmb2_APFjvHxKTFxLbBZ9owWfgGcX", found: true },
      ],
      details: {
        description: "Developer-friendly email API for sending transactional emails, order confirmations, and customer communications.",
        cost: "Free: 100 emails/day | Pro: $20/month for 50,000 emails",
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
    {
      name: "Vercel",
      icon: "🚀",
      status: "complete",
      signUpUrl: "https://vercel.com/signup",
      dashboardUrl: "https://vercel.com/dashboard",
      docsUrl: "https://vercel.com/docs",
      keys: [],
    },
    {
      name: "GitHub",
      icon: "🐙",
      status: "complete",
      signUpUrl: "https://github.com/signup",
      dashboardUrl: "https://github.com",
      docsUrl: "https://docs.github.com",
      keys: [],
      details: {
        description: "Version control and code hosting platform for managing project repositories, collaboration, and CI/CD.",
        cost: "Free for public repos | Pro: $4/month for private repos",
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
    {
      name: "Cursor Pro",
      icon: "⌨️",
      status: "complete",
      signUpUrl: "https://cursor.sh",
      dashboardUrl: "https://cursor.sh",
      docsUrl: "https://docs.cursor.sh",
      keys: [],
      details: {
        description: "AI-powered code editor that uses advanced language models to help write, edit, and understand code faster.",
        cost: "Pro Plan: $20/month",
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
  ]);

  const [payments] = useState<Payment[]>([
    {
      service: "Supabase",
      plan: "Free Tier (Current)",
      amount: 0,
      frequency: "one-time",
      nextDue: "N/A",
      status: "active",
    },
    {
      service: "Supabase Pro",
      plan: "Pro Plan (Potential Upgrade)",
      amount: 25,
      frequency: "monthly",
      nextDue: "When upgraded",
      status: "pending",
      notes: "Upgrade when storage/database limits are reached",
    },
    {
      service: "fal.ai",
      plan: "Pay-as-you-go",
      amount: 0,
      frequency: "one-time",
      nextDue: "N/A",
      status: "pending",
    },
    {
      service: "Stripe",
      plan: "Free (2.9% + $0.30 per transaction)",
      amount: 0,
      frequency: "one-time",
      nextDue: "N/A",
      status: "active",
    },
    {
      service: "Printful",
      plan: "Free (per-item fees)",
      amount: 0,
      frequency: "one-time",
      nextDue: "N/A",
      status: "active",
    },
    {
      service: "Resend",
      plan: "Free Tier (100 emails/day)",
      amount: 0,
      frequency: "monthly",
      nextDue: "2025-01-06",
      status: "active",
    },
    {
      service: "Vercel",
      plan: "Hobby (Free)",
      amount: 0,
      frequency: "one-time",
      nextDue: "N/A",
      status: "active",
    },
    {
      service: "Domain (furandfriends.com)",
      plan: "Annual Registration",
      amount: 20,
      frequency: "yearly",
      nextDue: "2026-12-04",
      status: "active",
      notes: "Domain registration - renews annually",
      expirationDate: "2026-12-04",
    },
    {
      service: "Cursor Pro",
      plan: "Pro Plan",
      amount: 20,
      frequency: "monthly",
      nextDue: "2025-02-06",
      status: "active",
      notes: "AI coding assistant subscription",
    },
    {
      service: "Google Cloud",
      plan: "Basic Plan",
      amount: 1.99,
      frequency: "monthly",
      nextDue: "2025-01-06",
      status: "active",
      notes: "Cloud storage and services",
    },
  ]);

  const [taxRecords, setTaxRecords] = useState<TaxRecord[]>([]);
  const taxRecordsInitialized = useRef(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    category: "one-time" as TaxRecord["category"],
    service: "",
    notes: "",
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("milestones") : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: "1", title: "Form LLC", description: "Register Timberline Collective LLC with Oregon Secretary of State", completed: false, category: "legal" },
      { id: "2", title: "Get EIN", description: "Obtain Employer Identification Number from IRS", completed: false, category: "legal" },
      { id: "3", title: "Register DBA", description: "Register 'Fur & Fame' as Doing Business As name", completed: false, category: "legal" },
      { id: "4", title: "Open Business Bank Account", description: "Open business checking account with EIN and LLC documents", completed: false, category: "setup" },
      { id: "5", title: "Set Up Stripe Account", description: "Complete Stripe account setup and verify business information", completed: false, category: "payment" },
      { id: "6", title: "Add Stripe Payment Info", description: "Add bank account and payment details to Stripe", completed: false, category: "payment" },
      { id: "7", title: "Set Up Supabase", description: "Configure Supabase database, auth, and storage", completed: false, category: "integration" },
      { id: "8", title: "Set Up fal.ai API", description: "Configure fal.ai API keys and test portrait generation", completed: false, category: "integration" },
      { id: "9", title: "Set Up Printful Account", description: "Create Printful account and connect products", completed: false, category: "integration" },
      { id: "10", title: "Set Up Resend Email", description: "Configure Resend API for transactional emails", completed: true, category: "integration", dateCompleted: new Date().toISOString().split('T')[0] },
      { id: "11", title: "Deploy to Vercel", description: "Deploy Next.js app to Vercel production", completed: false, category: "setup" },
      { id: "12", title: "Set Up Domain", description: "Purchase and configure custom domain", completed: false, category: "setup" },
      { id: "13", title: "Launch Marketing", description: "Create social media accounts and start marketing", completed: false, category: "marketing" },
      { id: "14", title: "Update Stripe Email", description: "Change Stripe account email to ccates.timberlinecollective@gmail.com", completed: false, category: "setup" },
      { id: "15", title: "Update Supabase Email", description: "Change Supabase account email to ccates.timberlinecollective@gmail.com (after support removes suppression)", completed: false, category: "setup" },
      { id: "16", title: "Update fal.ai Email", description: "Change fal.ai account email to ccates.timberlinecollective@gmail.com", completed: true, category: "setup", dateCompleted: new Date().toISOString().split("T")[0] },
      { id: "17", title: "Update GitHub Email", description: "Change GitHub account email to ccates.timberlinecollective@gmail.com", completed: true, category: "setup", dateCompleted: new Date().toISOString().split("T")[0] },
      { id: "18", title: "Update LLC Email", description: "Update Timberline Collective LLC email with Oregon Secretary of State", completed: true, category: "legal", dateCompleted: new Date().toISOString().split("T")[0] },
    ];
  });

  // Supabase Usage Monitoring Constants (moved before hooks)
  const SUPABASE_LIMITS = {
    database: 500, // MB
    storage: 1024, // MB (1GB)
    bandwidth: 2, // GB
  };
  const ALERT_THRESHOLD = 0.8; // 80%

  // All remaining hooks must be at the top (before conditional returns)
  const [githubProjects] = useState<GitHubProject[]>([
    {
      name: "Fur_and_Fame",
      description: "AI Pet Portrait E-Commerce Platform - Main Project",
      url: "https://github.com/ccates62/Fur_and_Fame",
      status: "active",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-api",
      description: "Backend API for Fur & Fame - Supabase integrations",
      url: "https://github.com/ccates62/fur-and-fame-api",
      status: "planning",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-stripe",
      description: "Stripe payment integration and webhook handlers",
      url: "https://github.com/ccates62/fur-and-fame-stripe",
      status: "planning",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-printful",
      description: "Printful API integration for order fulfillment",
      url: "https://github.com/ccates62/fur-and-fame-printful",
      status: "planning",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-ai",
      description: "fal.ai integration for AI portrait generation",
      url: "https://github.com/ccates62/fur-and-fame-ai",
      status: "planning",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-email",
      description: "Resend email templates and automation",
      url: "https://github.com/ccates62/fur-and-fame-email",
      status: "planning",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-video",
      description: "Remotion video generation for TikTok ads",
      url: "https://github.com/ccates62/fur-and-fame-video",
      status: "planning",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-docs",
      description: "Documentation and setup guides",
      url: "https://github.com/ccates62/fur-and-fame-docs",
      status: "planning",
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "Markdown",
    },
  ]);

  const [falUsage, setFalUsage] = useState({
    balance: 0,
    todayUsage: 0,
    monthUsage: 0,
    alertThreshold: 10.0,
    dailyUsage: [0, 0, 0, 0, 0, 0, 0],
    history: [] as Array<{ date: string; usage: number; balance: number }>,
    lastFetch: null as string | null,
    autoRefresh: false,
  });

  const [supabaseUsage, setSupabaseUsage] = useState({
    database: 0,
    storage: 0,
    bandwidth: 0,
    history: {
      database: [0, 0, 0, 0, 0, 0, 0],
      storage: [0, 0, 0, 0, 0, 0, 0],
      bandwidth: [0, 0, 0, 0, 0, 0, 0],
    },
    lastUpdate: null as string | null,
  });

  const updateSupabaseDisplay = useCallback(() => {
    const dbUsageEl = document.getElementById("dbUsage");
    const storageUsageEl = document.getElementById("storageUsage");
    const bandwidthUsageEl = document.getElementById("bandwidthUsage");
    const dbProgressEl = document.getElementById("dbProgress");
    const storageProgressEl = document.getElementById("storageProgress");
    const bandwidthProgressEl = document.getElementById("bandwidthProgress");
    const statusEl = document.getElementById("supabaseStatus");
    const alertBoxEl = document.getElementById("supabaseAlertBox");
    const alertMessageEl = document.getElementById("supabaseAlertMessage");
    const lastUpdateEl = document.getElementById("supabaseLastUpdate");

    if (dbUsageEl) dbUsageEl.textContent = `${supabaseUsage.database.toFixed(1)} MB`;
    if (storageUsageEl) storageUsageEl.textContent = `${supabaseUsage.storage.toFixed(1)} MB`;
    if (bandwidthUsageEl) bandwidthUsageEl.textContent = `${supabaseUsage.bandwidth.toFixed(2)} GB`;

    const dbPercent = (supabaseUsage.database / SUPABASE_LIMITS.database) * 100;
    const storagePercent = (supabaseUsage.storage / SUPABASE_LIMITS.storage) * 100;
    const bandwidthPercent = (supabaseUsage.bandwidth / SUPABASE_LIMITS.bandwidth) * 100;

    if (dbProgressEl) {
      dbProgressEl.style.width = `${Math.min(dbPercent, 100)}%`;
      dbProgressEl.style.backgroundColor = dbPercent >= 80 ? "#ef4444" : dbPercent >= 60 ? "#f59e0b" : "#3b82f6";
    }
    if (storageProgressEl) {
      storageProgressEl.style.width = `${Math.min(storagePercent, 100)}%`;
      storageProgressEl.style.backgroundColor = storagePercent >= 80 ? "#ef4444" : storagePercent >= 60 ? "#f59e0b" : "#3b82f6";
    }
    if (bandwidthProgressEl) {
      bandwidthProgressEl.style.width = `${Math.min(bandwidthPercent, 100)}%`;
      bandwidthProgressEl.style.backgroundColor = bandwidthPercent >= 80 ? "#ef4444" : bandwidthPercent >= 60 ? "#f59e0b" : "#3b82f6";
    }

    const hasAlert = dbPercent >= 80 || storagePercent >= 80 || bandwidthPercent >= 80;
    if (statusEl) {
      statusEl.textContent = hasAlert ? "⚠️ Alert" : "✅ Healthy";
      statusEl.className = hasAlert ? "text-red-600 font-bold" : "text-green-600 font-bold";
    }

    if (alertBoxEl && alertMessageEl) {
      if (hasAlert) {
        const alerts = [];
        if (dbPercent >= 80) alerts.push(`Database: ${dbPercent.toFixed(1)}%`);
        if (storagePercent >= 80) alerts.push(`Storage: ${storagePercent.toFixed(1)}%`);
        if (bandwidthPercent >= 80) alerts.push(`Bandwidth: ${bandwidthPercent.toFixed(1)}%`);
        alertMessageEl.textContent = `⚠️ ${alerts.join(", ")} - Approaching limits!`;
        alertBoxEl.className = "bg-red-50 border border-red-200 rounded-lg p-3 mb-4";
      } else {
        alertBoxEl.className = "hidden";
      }
    }

    if (lastUpdateEl && supabaseUsage.lastUpdate) {
      lastUpdateEl.textContent = `Last updated: ${supabaseUsage.lastUpdate}`;
    }
  }, [supabaseUsage]);

  useEffect(() => {
    checkAccess();
  }, []);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("falUsageData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setFalUsage((prev) => ({ ...prev, ...data }));
      } catch (e) {
        console.error("Error loading saved data:", e);
      }
    }

    const supabaseSaved = localStorage.getItem("supabaseUsageData");
    if (supabaseSaved) {
      try {
        const data = JSON.parse(supabaseSaved);
        setSupabaseUsage((prev) => ({ ...prev, ...data }));
      } catch (e) {
        console.error("Error loading Supabase data:", e);
      }
    }
  }, []);

  // Toggle auto-refresh
  useEffect(() => {
    if (falUsage.autoRefresh) {
      const fetchFalBalance = async () => {
        try {
          const response = await fetch("/api/fal-balance");
          if (response.ok) {
            const data = await response.json();
            setFalUsage((prev) => ({
              ...prev,
              balance: data.balance || 0,
              todayUsage: data.todayUsage || 0,
              monthUsage: data.monthUsage || 0,
              lastFetch: new Date().toISOString(),
            }));
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
      fetchFalBalance();
      const interval = setInterval(() => {
        fetchFalBalance();
      }, 300000);
      return () => clearInterval(interval);
    }
  }, [falUsage.autoRefresh]);

  // Update chart when data changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Chart) {
      const updateChart = () => {
        const ctx = document.getElementById("usageChart") as HTMLCanvasElement;
        if (!ctx) return;

        const Chart = (window as any).Chart;
        if (!Chart) return;

        const labels = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          labels.push(
            date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          );
        }

        const existingChart = (Chart as any).getChart(ctx);
        if (existingChart) {
          existingChart.destroy();
        }

        new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Daily Usage ($)",
                data: falUsage.dailyUsage,
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value: any) {
                    return "$" + value.toFixed(2);
                  },
                },
              },
            },
          },
        });
      };
      updateChart();
    }
  }, [falUsage.dailyUsage]);

  // Use setTimeout to ensure DOM is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSupabaseDisplay();
    }, 100);
    return () => clearTimeout(timer);
  }, [updateSupabaseDisplay]);

  // Check for recurring payments
  useEffect(() => {
    const checkRecurringPayments = () => {
      const today = new Date();
      payments.forEach((payment) => {
        if (payment.frequency === "monthly" && payment.nextDue && payment.status === "active") {
          const dueDate = new Date(payment.nextDue);
          if (dueDate <= today) {
            console.log(`⚠️ Payment due: ${payment.service} - $${payment.amount}`);
          }
        }
      });
    };
    checkRecurringPayments();
    const interval = setInterval(checkRecurringPayments, 86400000); // Check daily
    return () => clearInterval(interval);
  }, [payments]);

  const checkAccess = async () => {
    try {
      // CRITICAL: Only allow access from localhost
      // Block access from production domains (furandfame.com, www.furandfame.com, etc.)
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.startsWith("10.0.");
        const isProduction = hostname === "furandfame.com" || hostname === "www.furandfame.com" || hostname.endsWith(".vercel.app");
        
        if (!isLocalhost || isProduction) {
          console.warn("❌ Access denied - accounts page is only available on localhost");
          setLoading(false);
          setAccessError(
            "Access denied. The accounts page is only available on localhost for security reasons."
          );
          setTimeout(() => {
            router.push("/");
          }, 2000);
          return;
        }
      }

      const supabase = getSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push("/auth/login");
        return;
      }

      // Check if user is the owner
      // Get owner email from env (trimmed to handle whitespace)
      const ownerEmail = (getOwnerEmail() || "").trim().toLowerCase();
      const userEmail = (user.email || "").trim().toLowerCase();
      
      // Require owner email to be set and match exactly
      const userIsOwner = ownerEmail && userEmail === ownerEmail;
      
      // Debug logging
      console.log("🔍 Owner Access Check:", {
        hostname: typeof window !== "undefined" ? window.location.hostname : "server",
        ownerEmailFromEnv: getOwnerEmail(),
        ownerEmailNormalized: ownerEmail,
        userEmailRaw: user.email,
        userEmailNormalized: userEmail,
        emailsMatch: userEmail === ownerEmail,
        isOwner: userIsOwner,
        hasOwnerEmailInEnv: !!getOwnerEmail(),
      });
      
      if (!userIsOwner) {
        console.warn("❌ Access denied - not owner. Redirecting to customer dashboard.");
        
        // Set loading to false first so error message can be displayed
        setLoading(false);
        
        // Show error message before redirect
        setAccessError(
          `Access denied. Your email (${user.email}) does not match the owner email configured in the system. ` +
          `If you believe this is an error, check your .env.local file for NEXT_PUBLIC_OWNER_EMAIL.`
        );
        
        // Wait a moment to show error, then redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
        return;
      }
      
      console.log("✅ Owner access granted!");

      setIsOwner(true);
      setLoading(false);
    } catch (err) {
      console.error("Error checking access:", err);
      router.push("/auth/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (accessError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">{accessError}</p>
            <p className="text-sm text-gray-500">Redirecting to customer dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return null; // Will redirect
  }
  
  // All hooks are now at the top - continue with component logic
  
  // Helper functions (not hooks)
  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert("Please fill in description and amount");
      return;
    }
    const record: TaxRecord = {
      id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: newExpense.date,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      service: newExpense.service || undefined,
      notes: newExpense.notes || undefined,
    };
    
    // Get current records from localStorage to ensure we have the latest
    const currentSaved = localStorage.getItem("taxRecords");
    let currentRecords: TaxRecord[] = [];
    if (currentSaved) {
      try {
        currentRecords = JSON.parse(currentSaved);
      } catch (e) {
        currentRecords = [...taxRecords];
      }
    } else {
      currentRecords = [...taxRecords];
    }
    
    // Add new record
    const updated = [...currentRecords, record].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Save to both state and localStorage
    setTaxRecords(updated);
    localStorage.setItem("taxRecords", JSON.stringify(updated));
    
    // Clear form
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      description: "",
      amount: "",
      category: "one-time",
      service: "",
      notes: "",
    });
    alert("✅ Expense added!");
  };

  const deleteExpense = (id: string) => {
    if (confirm("Delete this expense record?")) {
      const updated = taxRecords.filter((r) => r.id !== id);
      setTaxRecords(updated);
      localStorage.setItem("taxRecords", JSON.stringify(updated));
    }
  };

  const toggleMilestone = (id: string) => {
    const updated = milestones.map((m) => {
      if (m.id === id) {
        const newCompleted = !m.completed;
        return {
          ...m,
          completed: newCompleted,
          dateCompleted: newCompleted ? new Date().toISOString().split("T")[0] : undefined,
        };
      }
      return m;
    });
    setMilestones(updated);
    localStorage.setItem("milestones", JSON.stringify(updated));
  };

  // Helper functions (not hooks) - continue with component logic
  // Save data to localStorage
  const saveFalUsage = (data: Partial<typeof falUsage>) => {
    const updated = { ...falUsage, ...data };
    setFalUsage(updated);
    localStorage.setItem("falUsageData", JSON.stringify(updated));
  };

  // Fetch balance from Next.js API
  const fetchFalBalance = async () => {
    try {
      const response = await fetch("/api/fal/balance", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        const now = new Date().toISOString().split("T")[0];
        const newHistory = [
          {
            date: now,
            usage: data.todayUsage || 0,
            balance: data.balance || 0,
          },
          ...falUsage.history.slice(0, 29),
        ];

        const newDailyUsage = [...falUsage.dailyUsage];
        newDailyUsage.shift();
        newDailyUsage.push(data.todayUsage || 0);

        saveFalUsage({
          balance: data.balance || 0,
          todayUsage: data.todayUsage || 0,
          monthUsage: data.monthUsage || 0,
          history: newHistory,
          dailyUsage: newDailyUsage,
          lastFetch: new Date().toLocaleTimeString(),
        });
        return true;
      } else {
        const errorData = await response.json();
        alert("Failed to fetch: " + (errorData.error || "Unknown error"));
        return false;
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      alert("Error: Make sure Next.js dev server is running");
      return false;
    }
  };

  const updateChart = () => {
    const ctx = document.getElementById("usageChart") as HTMLCanvasElement;
    if (!ctx) return;

    const Chart = (window as any).Chart;
    if (!Chart) return;

    const labels = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
    }

    const existingChart = (Chart as any).getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Usage ($)",
            data: falUsage.dailyUsage,
            borderColor: "#f59e0b",
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return "$" + value.toFixed(2);
              },
            },
          },
        },
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Fallback copy method for browsers that don't support clipboard API
  const fallbackCopy = (text: string, btn: HTMLButtonElement) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } else {
        alert('Copy failed. Please manually copy: ' + text);
      }
    } catch (err) {
      alert('Copy failed. Please manually copy: ' + text);
    }
    
    document.body.removeChild(textArea);
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank");
  };

  // Supabase Usage Functions
  const saveSupabaseUsage = (data: Partial<typeof supabaseUsage>) => {
    const updated = { ...supabaseUsage, ...data };
    setSupabaseUsage(updated);
    localStorage.setItem("supabaseUsageData", JSON.stringify(updated));
    updateSupabaseDisplay();
  };

  const updateSupabaseUsage = () => {
    const dbInput = document.getElementById("dbInput") as HTMLInputElement;
    const storageInput = document.getElementById("storageInput") as HTMLInputElement;
    const bandwidthInput = document.getElementById("bandwidthInput") as HTMLInputElement;

    const db = Math.min(parseFloat(dbInput.value) || supabaseUsage.database, SUPABASE_LIMITS.database);
    const storage = Math.min(parseFloat(storageInput.value) || supabaseUsage.storage, SUPABASE_LIMITS.storage);
    const bandwidth = Math.min(parseFloat(bandwidthInput.value) || supabaseUsage.bandwidth, SUPABASE_LIMITS.bandwidth);

    // Only update if values were actually entered
    const finalDb = dbInput.value ? db : supabaseUsage.database;
    const finalStorage = storageInput.value ? storage : supabaseUsage.storage;
    const finalBandwidth = bandwidthInput.value ? bandwidth : supabaseUsage.bandwidth;

    const newHistory = {
      database: [...supabaseUsage.history.database.slice(1), finalDb],
      storage: [...supabaseUsage.history.storage.slice(1), finalStorage],
      bandwidth: [...supabaseUsage.history.bandwidth.slice(1), finalBandwidth],
    };

    saveSupabaseUsage({
      database: finalDb,
      storage: finalStorage,
      bandwidth: finalBandwidth,
      history: newHistory,
      lastUpdate: new Date().toLocaleString(),
    });

    // Clear inputs
    dbInput.value = "";
    storageInput.value = "";
    bandwidthInput.value = "";
    
    // Show success message
    const lastUpdateSpan = document.getElementById("supabaseLastUpdate");
    if (lastUpdateSpan) {
      lastUpdateSpan.textContent = `✅ Updated at ${new Date().toLocaleTimeString()}`;
      lastUpdateSpan.className = "text-xs text-green-600 font-medium";
      setTimeout(() => {
        lastUpdateSpan.textContent = "";
        lastUpdateSpan.className = "text-xs text-gray-500";
      }, 3000);
    }
  };

  // Helper functions continue here (no hooks after conditional returns)
  // Note: All useEffect hooks must be at the top, before conditional returns

  // Calculate payment totals
  const totalMonthly = payments
    .filter((p) => p.frequency === "monthly" && p.status === "active")
    .reduce((sum, p) => sum + p.amount, 0);
  
  const potentialMonthly = payments
    .filter((p) => p.frequency === "monthly")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalAnnual = payments
    .filter((p) => p.frequency === "yearly" && p.status === "active")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <BreedNotification 
        enabled={breedNotificationsEnabled}
        onToggle={setBreedNotificationsEnabled}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
        <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              🐾 Fur & Fame - Accounts Dashboard
            </h1>
            <div className="flex gap-3">
              <Link
                href="/create"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
              >
                🎨 Create Portrait
              </Link>
              <button
                onClick={(e) => {
                  // Save all localStorage data
                  try {
                    const taxRecordsData = localStorage.getItem('taxRecords');
                    const supabaseUsageData = localStorage.getItem('supabaseUsage');
                    const falUsageData = localStorage.getItem('falUsage');
                    const milestonesData = localStorage.getItem('milestones');
                    
                    if (taxRecordsData) localStorage.setItem('taxRecords', taxRecordsData);
                    if (supabaseUsageData) localStorage.setItem('supabaseUsage', supabaseUsageData);
                    if (falUsageData) localStorage.setItem('falUsage', falUsageData);
                    if (milestonesData) localStorage.setItem('milestones', milestonesData);
                    
                    const btn = e.currentTarget;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✅ Saved!';
                    btn.className = 'bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2';
                    setTimeout(() => {
                      btn.innerHTML = originalText;
                      btn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2';
                    }, 2000);
                  } catch (error) {
                    alert('⚠️ Error saving data: ' + (error as Error).message);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
              >
                💾 Save All Work
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link
            href="/accounts/progress"
            className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200 hover:border-amber-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Launch Progress</p>
                <p className="text-2xl font-bold text-gray-900">43%</p>
                <p className="text-xs text-gray-500 mt-1">3/7 steps complete</p>
            </div>
              <span className="text-4xl">🚀</span>
          </div>
          </Link>
          <Link
            href="/accounts/services"
            className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200 hover:border-blue-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Services</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500 mt-1">All configured</p>
          </div>
              <span className="text-4xl">🔑</span>
        </div>
          </Link>
          <Link
            href="/accounts/payments"
            className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200 hover:border-green-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Costs</p>
                <p className="text-2xl font-bold text-gray-900">$20</p>
                <p className="text-xs text-gray-500 mt-1">Active subscriptions</p>
          </div>
              <span className="text-4xl">💳</span>
            </div>
          </Link>
          <Link
            href="/accounts/usage"
            className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200 hover:border-purple-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">API Usage</p>
                <p className="text-2xl font-bold text-gray-900">Low</p>
                <p className="text-xs text-gray-500 mt-1">All within limits</p>
              </div>
              <span className="text-4xl">📈</span>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/create"
              className="flex items-center gap-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg hover:border-amber-400 transition"
            >
              <span className="text-3xl">🎨</span>
              <div>
                <p className="font-semibold text-gray-900">Create Pet Portrait</p>
                <p className="text-sm text-gray-600">Upload photo & generate AI portrait</p>
          </div>
            </Link>
            <Link
              href="/accounts/progress"
              className="flex items-center gap-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition"
            >
              <span className="text-3xl">🚀</span>
              <div>
                <p className="font-semibold text-gray-900">View Progress</p>
                <p className="text-sm text-gray-600">Track launch milestones</p>
              </div>
            </Link>
            <Link
              href="/accounts/services"
              className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:border-green-400 transition"
            >
              <span className="text-3xl">🔑</span>
              <div>
                <p className="font-semibold text-gray-900">API Keys</p>
                <p className="text-sm text-gray-600">Manage service credentials</p>
              </div>
            </Link>
              </div>
          </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Business Links */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">🔗 Quick Links</h2>
                <p className="text-gray-600">Access all your business tools and services</p>
                          </div>
              <Link
                href="/accounts/links"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
              >
                View All Links →
              </Link>
                          </div>
                        </div>
                        
          {/* Analytics & Data */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between">
                          <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">📊 Analytics & Data</h2>
                <p className="text-gray-600">Monitor costs, usage, and progress graphs</p>
                          </div>
              <Link
                href="/accounts/analytics"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
              >
                View Analytics →
              </Link>
                              </div>
                            </div>
                          
          {/* LLC Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">🏢 LLC Information</h2>
                <p className="text-gray-600">Click any field to copy</p>
              </div>
              <button
                onClick={() => {
                  const fullInfo = `Timberline Collective LLC\nEIN: 41-2989148\nRegistry: 2500020-95\nStatus: ACT\nRenewal: 12-08-2026\nDBA: Fur and Fame\nDBA Registry: 250095594`;
                  navigator.clipboard.writeText(fullInfo);
                  alert("✅ All LLC information copied to clipboard!");
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
              >
                📋 Copy All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Legal Business Name</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono text-gray-900 flex-1 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => {
                    navigator.clipboard.writeText("Timberline Collective LLC");
                    alert("✅ Copied: Timberline Collective LLC");
                  }}>Timberline Collective LLC</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("Timberline Collective LLC");
                      alert("✅ Copied!");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">EIN</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono text-gray-900 flex-1 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => {
                    navigator.clipboard.writeText("41-2989148");
                    alert("✅ Copied: 41-2989148");
                  }}>41-2989148</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("41-2989148");
                      alert("✅ Copied!");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Registry Number</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono text-gray-900 flex-1 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => {
                    navigator.clipboard.writeText("2500020-95");
                    alert("✅ Copied: 2500020-95");
                  }}>2500020-95</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("2500020-95");
                      alert("✅ Copied!");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Status</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono text-gray-900 flex-1 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => {
                    navigator.clipboard.writeText("ACT");
                    alert("✅ Copied: ACT");
                  }}>ACT</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("ACT");
                      alert("✅ Copied!");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">DBA Name</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono text-gray-900 flex-1 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => {
                    navigator.clipboard.writeText("Fur and Fame");
                    alert("✅ Copied: Fur and Fame");
                  }}>Fur and Fame</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("Fur and Fame");
                      alert("✅ Copied!");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">DBA Registry</label>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono text-gray-900 flex-1 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => {
                    navigator.clipboard.writeText("250095594");
                    alert("✅ Copied: 250095594");
                  }}>250095594</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("250095594");
                      alert("✅ Copied!");
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    title="Copy"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>
                          
          {/* Business Bank Account */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">🏦 Business Bank Account</h2>
                <p className="text-gray-600">Access Mercury bank account and transactions</p>
              </div>
              <a
                href="https://mercury.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
              >
                Mercury Login →
              </a>
            </div>
          </div>
                          </div>
        
        {/* Important Files Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">📁 Important Files</h2>
              <p className="text-gray-600">Access important business documents and files</p>
            </div>
            <Link
              href="/accounts/important-files"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
            >
              View All Files →
            </Link>
          </div>
        </div>
                          
        {/* Service Monitoring */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-200">
          <div className="flex items-center justify-between">
                      <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">🔍 Service Monitoring</h2>
              <p className="text-gray-600">All services categorized with usage tracking</p>
                        </div>
            <Link
              href="/accounts/services-monitor"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
            >
              View All Services →
            </Link>
          </div>
        </div>

        {/* Tax Records / Business Expenses Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-green-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">💰 Business Expenses & Tax Records</h2>
              <p className="text-gray-600">Track all business expenses for tax purposes</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-green-600">
                ${taxRecords.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Add New Expense Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">➕ Add New Expense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g., Domain renewal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as TaxRecord["category"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="recurring">Recurring</option>
                  <option value="one-time">One-Time</option>
                  <option value="setup">Setup</option>
                  <option value="equipment">Equipment</option>
                  <option value="software">Software</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service (Optional)</label>
                <input
                  type="text"
                  value={newExpense.service}
                  onChange={(e) => setNewExpense({ ...newExpense, service: e.target.value })}
                  placeholder="e.g., Stripe, Vercel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="Additional details"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <button
              onClick={addExpense}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition shadow-md"
            >
              ➕ Add Expense
            </button>
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">📋 Expense History</h3>
              {taxRecords.length > 0 && (
                <p className="text-sm text-gray-600">
                  {taxRecords.length} expense{taxRecords.length !== 1 ? 's' : ''} recorded
                </p>
              )}
            </div>
            {taxRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg mb-2">No expenses recorded yet</p>
                <p className="text-sm mb-4">Add your first expense using the form above</p>
                <button
                  onClick={() => {
                    // Debug: Check localStorage and reload if found
                    const saved = localStorage.getItem("taxRecords");
                    if (saved) {
                      try {
                        const records = JSON.parse(saved);
                        console.log("📊 Found records in localStorage:", records);
                        if (Array.isArray(records) && records.length > 0) {
                          setTaxRecords(records);
                          taxRecordsInitialized.current = true;
                          alert(`✅ Found ${records.length} expense(s) in storage! Reloaded.`);
                        } else {
                          alert("No expenses found in storage (array is empty).");
                        }
                      } catch (e) {
                        alert("Error reading storage: " + e);
                      }
                    } else {
                      alert("No tax records found in localStorage.");
                    }
                  }}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-semibold transition"
                >
                  🔍 Check & Reload Expenses from Storage
                </button>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Description</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Service</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Amount</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Notes</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taxRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="p-3 font-medium text-gray-900">{record.description}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          record.category === "recurring" ? "bg-blue-100 text-blue-700" :
                          record.category === "one-time" ? "bg-purple-100 text-purple-700" :
                          record.category === "setup" ? "bg-yellow-100 text-yellow-700" :
                          record.category === "equipment" ? "bg-orange-100 text-orange-700" :
                          record.category === "software" ? "bg-green-100 text-green-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {record.category}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{record.service || "-"}</td>
                      <td className="p-3 text-right font-semibold text-green-600">${record.amount.toFixed(2)}</td>
                      <td className="p-3 text-sm text-gray-500">{record.notes || "-"}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => deleteExpense(record.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-green-50 border-t-2 border-green-300">
                    <td colSpan={4} className="p-3 text-right font-bold text-gray-900">Total:</td>
                    <td className="p-3 text-right font-bold text-green-600 text-lg">
                      ${taxRecords.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>

        {/* Sales Tracking Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">💰 Sales Tracking</h2>
              <p className="text-gray-600">Monitor your sales and revenue</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-green-600">
                ${sales.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{sales.length} sale{sales.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {sales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">No sales recorded yet</p>
              <p className="text-sm">Sales will be automatically tracked when you start receiving orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                    <th className="text-right p-3 font-semibold text-gray-700">Amount</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Order ID</th>
                  </tr>
                </thead>
                <tbody>
                  {sales
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((sale) => (
                      <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3 text-gray-700">{new Date(sale.date).toLocaleDateString()}</td>
                        <td className="p-3 font-medium text-gray-900">{sale.product}</td>
                        <td className="p-3 text-right font-semibold text-green-600">${sale.amount.toFixed(2)}</td>
                        <td className="p-3 text-sm text-gray-500">{sale.orderId || sale.id}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {sales.length > 10 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Showing 10 most recent sales. View all in Analytics page.
                </p>
              )}
            </div>
          )}
          <div className="mt-4">
            <Link
              href="/accounts/analytics"
              className="text-green-600 hover:text-green-700 font-semibold text-sm"
            >
              View Sales vs Costs Graph →
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
