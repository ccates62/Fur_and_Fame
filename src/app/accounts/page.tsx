"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Script from "next/script";

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
  const [expandedService, setExpandedService] = useState<number | null>(null);
  
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
      status: "pending",
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
  const taxRecordsInitialized = useRef(false); // Prevent double initialization

  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    category: "one-time" as TaxRecord["category"],
    service: "",
    notes: "",
  });

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

  const [githubProjects] = useState<GitHubProject[]>([
    {
      name: "Fur_and_Fame",
      description: "AI Pet Portrait E-Commerce Platform - Main Project",
      url: "https://github.com/ccates62/Fur_and_Fame",
      status: "active", // Currently working on this - update lastUpdated when you commit
      lastUpdated: "2025-12-06", // Update this date: YYYY-MM-DD format
      branch: "main",
      language: "TypeScript",
    },
    // NOTE: Update status from "planning" → "active" as you start working on each project
    // Update lastUpdated date when you make commits to each repository
    {
      name: "fur-and-fame-api",
      description: "Backend API for Fur & Fame - Supabase integrations",
      url: "https://github.com/ccates62/fur-and-fame-api",
      status: "planning", // Change to "active" when you start working on Supabase integration
      lastUpdated: "2025-12-06", // Update this date when you push code
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-stripe",
      description: "Stripe payment integration and webhook handlers",
      url: "https://github.com/ccates62/fur-and-fame-stripe",
      status: "planning", // Change to "active" when you start working on Stripe
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-printful",
      description: "Printful API integration for order fulfillment",
      url: "https://github.com/ccates62/fur-and-fame-printful",
      status: "planning", // Change to "active" when you start working on Printful
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-ai",
      description: "fal.ai integration for AI portrait generation",
      url: "https://github.com/ccates62/fur-and-fame-ai",
      status: "planning", // Change to "active" when you start working on AI generation
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-email",
      description: "Resend email templates and automation",
      url: "https://github.com/ccates62/fur-and-fame-email",
      status: "planning", // Change to "active" when you start working on emails
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-video",
      description: "Remotion video generation for TikTok ads",
      url: "https://github.com/ccates62/fur-and-fame-video",
      status: "planning", // Change to "active" when you start working on video generation
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "TypeScript",
    },
    {
      name: "fur-and-fame-docs",
      description: "Documentation and setup guides",
      url: "https://github.com/ccates62/fur-and-fame-docs",
      status: "planning", // Change to "active" when you start adding documentation
      lastUpdated: "2025-12-06",
      branch: "main",
      language: "Markdown",
    },
  ]);

  // fal.ai Usage Monitoring State
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

  // Supabase Usage Monitoring State
  const SUPABASE_LIMITS = {
    database: 500, // MB
    storage: 1024, // MB (1GB)
    bandwidth: 2, // GB
  };
  const ALERT_THRESHOLD = 0.8; // 80%

  const [supabaseUsage, setSupabaseUsage] = useState({
    database: 0, // MB
    storage: 0, // MB
    bandwidth: 0, // GB
    history: {
      database: [0, 0, 0, 0, 0, 0, 0], // Last 7 days
      storage: [0, 0, 0, 0, 0, 0, 0],
      bandwidth: [0, 0, 0, 0, 0, 0, 0],
    },
    lastUpdate: null as string | null,
  });

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

    // Load Supabase usage data
    const supabaseSaved = localStorage.getItem("supabaseUsageData");
    if (supabaseSaved) {
      try {
        const data = JSON.parse(supabaseSaved);
        setSupabaseUsage((prev) => ({ ...prev, ...data }));
      } catch (e) {
        console.error("Error loading Supabase usage data:", e);
      }
    }

    // Load tax records from localStorage - ONLY RUN ONCE on mount
    if (taxRecordsInitialized.current) {
      return; // Already initialized, don't run again
    }
    
    const taxSaved = localStorage.getItem("taxRecords");
    
    if (taxSaved) {
      try {
        const records = JSON.parse(taxSaved);
        // Only set records if we have valid data - don't modify it
        if (Array.isArray(records)) {
          setTaxRecords(records);
          taxRecordsInitialized.current = true;
          return; // Exit early - don't add defaults if we have existing records
        }
      } catch (e) {
        console.error("Error loading tax records:", e);
      }
    }
    
    // Only initialize defaults if localStorage is completely empty (first time ever)
    const today = new Date().toISOString().split("T")[0];
    const defaultRecords: TaxRecord[] = [
      {
        id: "cursor-pro-initial",
        date: today,
        description: "Cursor Pro - Monthly Subscription",
        amount: 20,
        category: "recurring",
        service: "Cursor Pro",
        notes: "Monthly AI coding assistant subscription",
      },
      {
        id: "google-cloud-initial",
        date: today,
        description: "Google Cloud - Monthly Subscription",
        amount: 1.99,
        category: "recurring",
        service: "Google Cloud",
        notes: "Cloud storage and services",
      },
    ];
    
    setTaxRecords(defaultRecords);
    localStorage.setItem("taxRecords", JSON.stringify(defaultRecords));
    taxRecordsInitialized.current = true;
  }, []);

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

  // Toggle auto-refresh
  useEffect(() => {
    if (falUsage.autoRefresh) {
      fetchFalBalance();
      const interval = setInterval(() => {
        fetchFalBalance();
      }, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [falUsage.autoRefresh]);

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

  // Update chart when data changes
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Chart) {
      updateChart();
    }
  }, [falUsage.dailyUsage]);

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

  const updateSupabaseDisplay = useCallback(() => {
    // Update display elements
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
      storageProgressEl.style.backgroundColor = storagePercent >= 80 ? "#ef4444" : storagePercent >= 60 ? "#f59e0b" : "#f59e0b";
    }
    if (bandwidthProgressEl) {
      bandwidthProgressEl.style.width = `${Math.min(bandwidthPercent, 100)}%`;
      bandwidthProgressEl.style.backgroundColor = bandwidthPercent >= 80 ? "#ef4444" : bandwidthPercent >= 60 ? "#f59e0b" : "#6366f1";
    }

    // Check for alerts
    const alerts: string[] = [];
    if (dbPercent >= ALERT_THRESHOLD * 100) {
      alerts.push(`Database: ${supabaseUsage.database.toFixed(1)}MB / ${SUPABASE_LIMITS.database}MB (${dbPercent.toFixed(1)}%)`);
    }
    if (storagePercent >= ALERT_THRESHOLD * 100) {
      alerts.push(`Storage: ${supabaseUsage.storage.toFixed(1)}MB / ${SUPABASE_LIMITS.storage}MB (${storagePercent.toFixed(1)}%)`);
    }
    if (bandwidthPercent >= ALERT_THRESHOLD * 100) {
      alerts.push(`Bandwidth: ${supabaseUsage.bandwidth.toFixed(2)}GB / ${SUPABASE_LIMITS.bandwidth}GB (${bandwidthPercent.toFixed(1)}%)`);
    }

    if (alerts.length > 0 && alertBoxEl && alertMessageEl) {
      alertBoxEl.classList.remove("hidden");
      alertMessageEl.textContent = `Approaching free tier limits: ${alerts.join(" | ")}`;
      if (statusEl) {
        statusEl.textContent = "⚠️ Warning";
        statusEl.className = "text-xl font-bold text-red-600";
      }
    } else if ((dbPercent >= 100 || storagePercent >= 100 || bandwidthPercent >= 100) && alertBoxEl && alertMessageEl) {
      alertBoxEl.classList.remove("hidden");
      alertMessageEl.textContent = "Free tier limits exceeded! Upgrade to Pro plan immediately.";
      if (statusEl) {
        statusEl.textContent = "🚨 Critical";
        statusEl.className = "text-xl font-bold text-red-700";
      }
    } else {
      if (alertBoxEl) alertBoxEl.classList.add("hidden");
      if (statusEl) {
        statusEl.textContent = "✅ Safe";
        statusEl.className = "text-xl font-bold text-green-600";
      }
    }

    if (lastUpdateEl && supabaseUsage.lastUpdate) {
      lastUpdateEl.textContent = `Last updated: ${supabaseUsage.lastUpdate}`;
    }
  }, [supabaseUsage]);

  // Update display when supabaseUsage changes
  useEffect(() => {
    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(() => {
      updateSupabaseDisplay();
    }, 0);
    return () => clearTimeout(timer);
  }, [updateSupabaseDisplay]);

  // Auto-add recurring expenses when renewal dates hit
  // NOTE: This reads from localStorage directly to avoid overwriting manually added expenses
  useEffect(() => {
    const checkRecurringPayments = () => {
      // Read directly from localStorage to get the latest data
      const taxSaved = localStorage.getItem("taxRecords");
      let currentRecords: TaxRecord[] = [];
      
      if (taxSaved) {
        try {
          currentRecords = JSON.parse(taxSaved);
        } catch (e) {
          console.error("Error reading tax records for recurring check:", e);
          return; // Don't proceed if we can't read the data
        }
      }
      
      const today = new Date().toISOString().split("T")[0];
      let hasNewRecords = false;

      // Check all active monthly recurring payments
      payments
        .filter((p) => p.frequency === "monthly" && p.status === "active" && p.amount > 0)
        .forEach((payment) => {
          const dueDate = payment.nextDue; // Format: "YYYY-MM-DD"
          
          if (dueDate && today >= dueDate) {
            // Check if we already added this month's payment for this service
            const currentMonth = new Date(today).getMonth();
            const currentYear = new Date(today).getFullYear();
            const lastPayment = currentRecords
              .filter((r) => r.service === payment.service)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

            const alreadyAdded = lastPayment && 
              new Date(lastPayment.date).getMonth() === currentMonth &&
              new Date(lastPayment.date).getFullYear() === currentYear;

            if (!alreadyAdded) {
              currentRecords.push({
                id: `${payment.service.toLowerCase().replace(/\s+/g, "-")}-recurring-${Date.now()}`,
                date: today,
                description: `${payment.service} - Monthly Subscription`,
                amount: payment.amount,
                category: "recurring",
                service: payment.service,
                notes: `Monthly recurring payment - ${payment.plan}`,
              });
              hasNewRecords = true;
            }
          }
        });

      if (hasNewRecords) {
        const sorted = currentRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        // Update both state and localStorage
        setTaxRecords(sorted);
        localStorage.setItem("taxRecords", JSON.stringify(sorted));
      }
    };

    // Check daily for recurring payments
    checkRecurringPayments();
    const interval = setInterval(checkRecurringPayments, 86400000); // Check once per day
    return () => clearInterval(interval);
  }, [payments]); // Removed taxRecords from dependencies to prevent overwriting manual additions

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
              <button
                onClick={(e) => {
                  // Save all localStorage data
                  try {
                    // Save tax records
                    const taxRecordsData = localStorage.getItem('taxRecords');
                    // Save usage data
                    const supabaseUsageData = localStorage.getItem('supabaseUsage');
                    const falUsageData = localStorage.getItem('falUsage');
                    // Save milestones
                    const milestonesData = localStorage.getItem('milestones');
                    
                    // Force a save by re-setting the data
                    if (taxRecordsData) localStorage.setItem('taxRecords', taxRecordsData);
                    if (supabaseUsageData) localStorage.setItem('supabaseUsage', supabaseUsageData);
                    if (falUsageData) localStorage.setItem('falUsage', falUsageData);
                    if (milestonesData) localStorage.setItem('milestones', milestonesData);
                    
                    // Show confirmation
                    const btn = e.currentTarget;
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✅ Saved!';
                    btn.className = 'bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2';
                    setTimeout(() => {
                      btn.innerHTML = originalText;
                      btn.className = 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2';
                    }, 2000);
                    
                    // Also show alert
                    alert('✅ All dashboard data saved!\n\n💡 Don\'t forget to save your code files in Cursor:\nPress Ctrl+K then S to save all files');
                  } catch (error) {
                    alert('⚠️ Error saving data: ' + (error as Error).message);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg flex items-center gap-2"
              >
                💾 Save All Work
              </button>
              <a
                href="http://localhost:3000/accounts"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
              >
                🔗 Open Dashboard
              </a>
            </div>
          </div>
          <p className="text-gray-600">
            Manage all your service accounts and monitor payments in one place
          </p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Memory Tip:</strong> Cursor has 12 processes open? 
              <a 
                href="file:///c:/Users/ccate/Fur_and_Fame/why-cursor-has-many-processes.md" 
                target="_blank"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                Learn why and how to reduce them
              </a> | 
              <a 
                href="file:///c:/Users/ccate/Fur_and_Fame/CURSOR-MEMORY-TIPS.md" 
                target="_blank"
                className="text-blue-600 hover:text-blue-800 underline ml-1"
              >
                Full optimization guide
              </a>
            </p>
          </div>
        </div>

        {/* Server Control Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8 border-2 border-blue-800">
          <h2 className="text-2xl font-bold text-white mb-3">
            🚀 Server Control
          </h2>
          <p className="text-blue-100 mb-4">
            Your Next.js development server is running! Access the dashboard features below.
          </p>
          
          {/* Copy-Paste Command */}
          <div className="bg-black bg-opacity-20 rounded-lg p-4 mb-4 border border-white border-opacity-30">
            <p className="text-blue-100 text-sm mb-2 font-medium">
              📋 Copy & Paste in PowerShell:
            </p>
            <div className="bg-black bg-opacity-30 p-3 rounded font-mono text-amber-300 text-sm relative">
              <code id="serverCommand" className="select-all block whitespace-pre">
                {`cd "c:\\Users\\ccate\\Fur_and_Fame"\nnpx next dev`}
              </code>
              <button
                onClick={(e) => {
                  const command = 'cd "c:\\Users\\ccate\\Fur_and_Fame"\nnpx next dev';
                  const btn = e.currentTarget;
                  
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(command)
                      .then(() => {
                        const originalText = btn.textContent;
                        if (originalText) {
                          btn.textContent = '✓ Copied!';
                          setTimeout(() => {
                            btn.textContent = originalText;
                          }, 2000);
                        }
                      })
                      .catch(() => {
                        fallbackCopy(command, btn);
                      });
                  } else {
                    fallbackCopy(command, btn);
                  }
                }}
                className="absolute top-2 right-2 bg-white bg-opacity-20 border border-white border-opacity-30 text-white px-2 py-1 rounded text-xs hover:bg-opacity-30 transition"
              >
                📋 Copy
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => window.open('http://localhost:3000/accounts', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              📊 Open Dashboard
            </button>
            <button
              onClick={() => window.open('http://localhost:3000', '_blank')}
              className="bg-white hover:bg-gray-100 text-blue-700 font-semibold px-6 py-3 rounded-lg transition"
            >
              🌐 Open Home Page
            </button>
            <span className="text-white bg-blue-500 px-4 py-2 rounded-lg text-sm">
              Server Status: Running ✅
            </span>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              🏢 Business Information
            </h2>
            <a
              href="file:///c:/Users/ccate/Fur_and_Fame/LLC-REQUIREMENTS-FOR-LAUNCH.md"
              target="_blank"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              📋 LLC Launch Checklist
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Business Name</p>
              <p className="text-lg font-semibold text-gray-900">Timberline Collective LLC</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Business Email</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://mail.google.com/mail/u/0/#inbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Open Gmail
                </a>
                <button
                  onClick={() => openUrl("https://mail.google.com/mail/u/0/#inbox")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold"
                >
                  📧
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Account Emails */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📧 Current Account Emails
          </h2>
          
          {/* Quick Email Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => window.open("https://mail.google.com/mail/u/?authuser=ccates.timberlinecollective@gmail.com", "_blank")}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2"
            >
              📧 Open Good Email
              <span className="text-xs opacity-90">(ccates.timberlinecollective@gmail.com)</span>
            </button>
            <button
              onClick={() => window.open("https://mail.google.com/mail/u/?authuser=ccates.timberlinecolletive@gmail.com", "_blank")}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-lg transition shadow-md flex items-center justify-center gap-2"
            >
              📧 Open Bad Email
              <span className="text-xs opacity-90">(ccates.timberlinecolletive@gmail.com)</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Stripe</p>
              <p className="text-base font-semibold text-green-700 break-all">ccates.timberlinecollective@gmail.com</p>
              <p className="text-xs text-green-600 mt-1">✅ Updated</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Supabase</p>
              <p className="text-base font-semibold text-gray-900 break-all">ccates.timberlinecolletive@gmail.com</p>
              <p className="text-xs text-red-600 mt-1 mb-2">⚠️ Needs update (flagged)</p>
              <button
                onClick={() => openUrl("https://supabase.com/dashboard/account")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
              >
                🔗 Update Email
              </button>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-gray-600 mb-1">fal.ai</p>
              <p className="text-base font-semibold text-green-700 break-all">ccates.timberlinecollective@gmail.com</p>
              <p className="text-xs text-green-600 mt-1">✅ Updated</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-gray-600 mb-1">GitHub</p>
              <p className="text-base font-semibold text-green-700 break-all">ccates.timberlinecollective@gmail.com</p>
              <p className="text-xs text-green-600 mt-1">✅ Updated</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-gray-600 mb-1">LLC (Oregon SOS)</p>
              <p className="text-base font-semibold text-green-700 break-all">ccates.timberlinecollective@gmail.com</p>
              <p className="text-xs text-green-600 mt-1 mb-2">✅ Updated</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openUrl("https://sos.oregon.gov/business/Pages/business-search.aspx")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                >
                  🔍 Check LLC Status
                </button>
                <button
                  onClick={() => openUrl("https://sos.oregon.gov/business/Pages/update-registration.aspx")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition"
                >
                  🔗 Update Registration
                </button>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm font-medium text-gray-600 mb-1">Target Email</p>
              <p className="text-base font-semibold text-green-700 break-all">ccates.timberlinecollective@gmail.com</p>
              <p className="text-xs text-green-600 mt-1">✅ Correct spelling</p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            💰 Payment Overview
          </h2>
          
          {/* Simple Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Monthly Recurring</p>
              <p className="text-2xl font-bold text-amber-700">${totalMonthly}</p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Annual Recurring</p>
              <p className="text-2xl font-bold text-purple-700">${totalAnnual}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Active Services</p>
              <p className="text-2xl font-bold text-green-700">{payments.filter((p) => p.status === "active").length}</p>
            </div>
          </div>

          {/* Simple Payment Breakdown Chart */}
          {payments.filter((p) => p.frequency === "monthly" && p.amount > 0).length > 0 && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Payment Breakdown</h3>
              <div className="space-y-2">
                {payments
                  .filter((p) => p.frequency === "monthly" && p.amount > 0)
                  .map((payment, idx) => {
                    const percentage = potentialMonthly > 0 ? (payment.amount / potentialMonthly) * 100 : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-gray-700">{payment.service}</span>
                          <span className="font-semibold text-gray-900">${payment.amount}/mo</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">Service</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Plan</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Amount</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Frequency</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Next Due</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-900">{payment.service}</td>
                    <td className="p-3 text-gray-600">{payment.plan}</td>
                    <td className="p-3 text-right font-bold text-amber-700">
                      {payment.amount > 0 ? `$${payment.amount}` : "Free"}
                    </td>
                    <td className="p-3 text-gray-600 capitalize">{payment.frequency}</td>
                    <td className="p-3 text-gray-600">{payment.nextDue}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        payment.status === "active" ? "bg-green-100 text-green-800" :
                        payment.status === "expired" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {payment.status === "active" ? "✅ Active" : payment.status === "expired" ? "❌ Expired" : "⏳ Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GitHub Projects */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              🐙 GitHub Projects
            </h2>
            <button
              onClick={() => openUrl("https://github.com/new")}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              + New Repository
            </button>
          </div>

          {/* Simple Project Stats */}
          {githubProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Active Projects</p>
                <p className="text-2xl font-bold text-green-700">
                  {githubProjects.filter((p) => p.status === "active").length}
                </p>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">In Planning</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {githubProjects.filter((p) => p.status === "planning").length}
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Total Repos</p>
                <p className="text-2xl font-bold text-blue-700">{githubProjects.length}</p>
              </div>
            </div>
          )}

          {/* Simple Status Distribution */}
          {githubProjects.length > 0 && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Project Status Distribution</h3>
              <div className="space-y-2">
                {["active", "planning", "archived"].map((status) => {
                  const count = githubProjects.filter((p) => p.status === status).length;
                  const total = githubProjects.length;
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  const colors = {
                    active: "bg-green-500",
                    planning: "bg-yellow-500",
                    archived: "bg-gray-400"
                  };
                  const labels = {
                    active: "✅ Active",
                    planning: "📋 Planning",
                    archived: "📦 Archived"
                  };
                  if (count === 0) return null;
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">{labels[status as keyof typeof labels]}</span>
                        <span className="font-semibold text-gray-900">{count} projects</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[status as keyof typeof colors]} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {githubProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-4">No GitHub projects yet</p>
              <button
                onClick={() => openUrl("https://github.com/new")}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Create Repository
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="text-left p-3 font-semibold text-gray-700">Repository</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Description</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Last Updated</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {githubProjects.map((project, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {project.name}
                        </a>
                      </td>
                      <td className="p-3 text-gray-600">{project.description}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          project.status === "active" ? "bg-green-100 text-green-800" :
                          project.status === "archived" ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {project.status === "active" ? "✅ Active" : project.status === "archived" ? "📦 Archived" : "📋 Planning"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{project.lastUpdated}</td>
                      <td className="p-3">
                        <button
                          onClick={() => openUrl(project.url)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          Open →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Project Milestones Checklist */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ Project Milestones Checklist
          </h2>
          <div className="mb-4 text-sm text-gray-600">
            Track your progress: {milestones.filter((m) => m.completed).length} of {milestones.length} completed (
            {Math.round((milestones.filter((m) => m.completed).length / milestones.length) * 100)}%)
          </div>
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                  milestone.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={milestone.completed}
                  onChange={() => toggleMilestone(milestone.id)}
                  className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${milestone.completed ? "text-green-800 line-through" : "text-gray-900"}`}>
                      {milestone.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      milestone.category === "legal" ? "bg-purple-100 text-purple-800" :
                      milestone.category === "payment" ? "bg-blue-100 text-blue-800" :
                      milestone.category === "setup" ? "bg-green-100 text-green-800" :
                      milestone.category === "integration" ? "bg-yellow-100 text-yellow-800" :
                      milestone.category === "marketing" ? "bg-pink-100 text-pink-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {milestone.category}
                    </span>
                  </div>
                  <p className={`text-sm ${milestone.completed ? "text-green-700" : "text-gray-600"}`}>
                    {milestone.description}
                  </p>
                  {milestone.completed && milestone.dateCompleted && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ Completed on {new Date(milestone.dateCompleted).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax Records & Expense Tracking */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Tax Records & Expense Tracking
          </h2>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">This Month</p>
              <p className="text-2xl font-bold text-blue-700">
                ${taxRecords
                  .filter((r) => {
                    const recordDate = new Date(r.date);
                    const now = new Date();
                    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
                  })
                  .reduce((sum, r) => sum + r.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">This Year</p>
              <p className="text-2xl font-bold text-green-700">
                ${taxRecords
                  .filter((r) => new Date(r.date).getFullYear() === new Date().getFullYear())
                  .reduce((sum, r) => sum + r.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Recurring (Monthly)</p>
              <p className="text-2xl font-bold text-purple-700">
                ${taxRecords
                  .filter((r) => r.category === "recurring")
                  .reduce((sum, r) => sum + r.amount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-amber-700">
                ${taxRecords.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Add New Expense Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">➕ Add New Expense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="e.g., Stripe monthly fee"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as TaxRecord["category"] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="recurring">Recurring Payment</option>
                  <option value="one-time">One-Time Expense</option>
                  <option value="setup">Setup/Initial Cost</option>
                  <option value="equipment">Equipment</option>
                  <option value="software">Software/Subscription</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Service (optional)</label>
                <input
                  type="text"
                  value={newExpense.service}
                  onChange={(e) => setNewExpense({ ...newExpense, service: e.target.value })}
                  placeholder="e.g., Stripe, Supabase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="Additional details"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              onClick={addExpense}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold text-sm"
            >
              💾 Add Expense
            </button>
          </div>

          {/* Expense List */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Description</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Service</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                  <th className="text-right p-3 font-semibold text-gray-700">Amount</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Notes</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {taxRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No expenses recorded yet. Add your first expense above!
                    </td>
                  </tr>
                ) : (
                  taxRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="p-3 font-semibold text-gray-900">{record.description}</td>
                      <td className="p-3 text-gray-600">{record.service || "-"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.category === "recurring" ? "bg-purple-100 text-purple-800" :
                          record.category === "one-time" ? "bg-blue-100 text-blue-800" :
                          record.category === "setup" ? "bg-green-100 text-green-800" :
                          record.category === "equipment" ? "bg-yellow-100 text-yellow-800" :
                          record.category === "software" ? "bg-indigo-100 text-indigo-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {record.category}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-gray-900">${record.amount.toFixed(2)}</td>
                      <td className="p-3 text-gray-600 text-xs">{record.notes || "-"}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteExpense(record.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Services Grid */}
        <div className={`grid gap-6 ${expandedService !== null ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-lg shadow-lg border-2 transition-all ${
                service.status === "complete"
                  ? "border-green-300"
                  : "border-gray-200"
              } ${expandedService === idx ? "p-6 col-span-full" : expandedService !== null ? "hidden" : "p-6"}`}
            >
              <div 
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setExpandedService(expandedService === idx ? null : idx)}
              >
                <h3 className={`font-bold text-gray-900 ${expandedService === idx ? "text-2xl" : "text-xl"}`}>
                  {service.icon} {service.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      service.status === "complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {service.status === "complete" ? "✅ Complete" : "⏳ Pending"}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                    {expandedService === idx ? "✕ Close" : "▶ Expand"}
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <button
                  onClick={() => openUrl(service.signUpUrl)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Sign Up / Dashboard
                </button>
                {(() => {
                  const payment = payments.find((p) => p.service === service.name || 
                    (service.name === "Cursor Pro" && p.service === "Cursor Pro") ||
                    (service.name === "Google Cloud" && p.service === "Google Cloud"));
                  const hasPayment = payment && payment.amount > 0 && payment.status === "active";
                  
                  if (hasPayment) {
                    const paymentUrls: { [key: string]: string } = {
                      "Cursor Pro": "https://cursor.sh/settings/billing",
                      "Google Cloud": "https://console.cloud.google.com/billing",
                      "Stripe": "https://dashboard.stripe.com/settings/billing",
                      "Supabase": "https://supabase.com/dashboard/project/_/settings/billing",
                      "fal.ai": "https://fal.ai/dashboard/billing",
                      "Printful": "https://www.printful.com/dashboard/settings/billing",
                      "Resend": "https://resend.com/settings/billing",
                      "Vercel": "https://vercel.com/dashboard/settings/billing",
                      "GitHub": "https://github.com/settings/billing",
                    };
                    const url = paymentUrls[service.name] || service.dashboardUrl;
                    return (
                      <button
                        onClick={() => openUrl(url)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        💳 Change Payment Method
                      </button>
                    );
                  }
                  return null;
                })()}
                {service.name === "Supabase" && (
                  <button
                    onClick={() => openUrl("https://supabase.com/pricing")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    ⭐ Upgrade to Pro Plan ($25/mo)
                  </button>
                )}
                {service.name === "fal.ai" && (
                  <button
                    onClick={() => openUrl("https://fal.ai/dashboard/billing")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    💳 Add Funds / Make Payment
                  </button>
                )}
                <button
                  onClick={() => openUrl(service.docsUrl)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  📚 Documentation
                </button>
              </div>

              {service.keys.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    API Keys:
                  </p>
                  <div className="space-y-2">
                    {service.keys.map((key, keyIdx) => (
                      <div
                        key={keyIdx}
                        className={`p-2 rounded text-xs ${
                          key.found ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-gray-600">
                            {key.name}
                          </span>
                          {key.found && (
                            <button
                              onClick={() => copyToClipboard(key.value)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              📋 Copy
                            </button>
                          )}
                        </div>
                        {key.found && (
                          <p className="text-gray-500 mt-1 break-all font-mono text-xs">
                            {key.value}
                          </p>
                        )}
                        {!key.found && (
                          <p className="text-gray-400 mt-1 text-xs italic">
                            {key.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expandable Details Section */}
              {expandedService === idx && (
                <div className="mt-4 pt-4 border-t-2 border-gray-300 animate-in slide-in-from-top-2">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    📊 Service Details & Analytics
                  </h4>
                  
                  {/* Service Information */}
                  {service.details && (
                    <div className="mb-4 space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <h5 className="text-base font-semibold text-gray-900 mb-2">What This Service Does:</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">{service.details.description}</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">
                        <h5 className="text-base font-semibold text-gray-900 mb-2">💰 Cost:</h5>
                        <p className="text-sm text-gray-700 font-medium">{service.details.cost}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                        <h5 className="text-base font-semibold text-gray-900 mb-2">🎯 Use Case:</h5>
                        <p className="text-sm text-gray-700 leading-relaxed">{service.details.useCase}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                        <h5 className="text-base font-semibold text-gray-900 mb-2">✨ Key Features:</h5>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                          {service.details.features.map((feature, fIdx) => (
                            <li key={fIdx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Supabase Usage Monitoring - Full Section */}
                  {service.name === "Supabase" && (
                    <div className="mt-4 space-y-4">
                      {/* Header with Action Buttons */}
                      <div className="flex justify-between items-center flex-wrap gap-3 pb-3 border-b-2 border-gray-300 mb-4">
                        <h5 className="text-xl font-bold text-gray-900">
                          📊 Usage Monitoring & Upgrade Alerts
                        </h5>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => openUrl("https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/billing")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                          >
                            ⭐ Upgrade to Pro ($25/mo)
                          </button>
                          <button
                            onClick={() => openUrl("https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                          >
                            📊 View Usage
                          </button>
                        </div>
                      </div>

                      {/* Free Tier Limits Info */}
                      <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                        <p className="text-sm text-amber-900 m-0">
                          <strong>Free Tier Limits:</strong> Database: 500MB | Storage: 1GB | Bandwidth: 2GB/month |{" "}
                          <strong>Alert Threshold:</strong> 80% (400MB / 800MB / 1.6GB)
                        </p>
                      </div>

                      {/* Usage Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div
                          id="dbStatBox"
                          className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200"
                        >
                          <p className="text-sm font-medium text-gray-600 mb-1">Database Size</p>
                          <p className="text-2xl font-bold text-blue-700 mb-1" id="dbUsage">
                            {supabaseUsage.database.toFixed(1)} MB
                          </p>
                          <p className="text-xs text-gray-500 mb-2">of 500 MB</p>
                          <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              id="dbProgress"
                              className="bg-blue-600 h-full transition-all duration-300"
                              style={{ width: `${Math.min((supabaseUsage.database / 500) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div
                          id="storageStatBox"
                          className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200"
                        >
                          <p className="text-sm font-medium text-gray-600 mb-1">Storage</p>
                          <p className="text-2xl font-bold text-amber-700 mb-1" id="storageUsage">
                            {supabaseUsage.storage.toFixed(1)} MB
                          </p>
                          <p className="text-xs text-gray-500 mb-2">of 1 GB</p>
                          <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              id="storageProgress"
                              className="bg-amber-600 h-full transition-all duration-300"
                              style={{ width: `${Math.min((supabaseUsage.storage / 1024) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div
                          id="bandwidthStatBox"
                          className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200"
                        >
                          <p className="text-sm font-medium text-gray-600 mb-1">Bandwidth (Month)</p>
                          <p className="text-2xl font-bold text-indigo-700 mb-1" id="bandwidthUsage">
                            {supabaseUsage.bandwidth.toFixed(2)} GB
                          </p>
                          <p className="text-xs text-gray-500 mb-2">of 2 GB</p>
                          <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              id="bandwidthProgress"
                              className="bg-indigo-600 h-full transition-all duration-300"
                              style={{ width: `${Math.min((supabaseUsage.bandwidth / 2) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                          <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                          <p
                            id="supabaseStatus"
                            className="text-xl font-bold text-green-600 mb-1"
                          >
                            ✅ Safe
                          </p>
                          <p className="text-xs text-gray-500">Free tier</p>
                        </div>
                      </div>

                      {/* Alert Box */}
                      <div
                        id="supabaseAlertBox"
                        className="hidden bg-red-50 border-2 border-red-400 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-red-900 mb-2">
                              Upgrade to Pro Plan Recommended!
                            </h3>
                            <p id="supabaseAlertMessage" className="text-sm text-red-800 mb-3"></p>
                            <button
                              onClick={() => openUrl("https://supabase.com/pricing")}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                            >
                              ⭐ Upgrade to Pro ($25/mo) →
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Manual Update Form */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                          <div>
                            <h6 className="text-lg font-semibold text-gray-900 mb-1">
                              📝 Quick Update
                            </h6>
                            <p className="text-sm text-gray-600">
                              Enter your current usage values below
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch('/api/supabase/usage');
                                const data = await response.json();
                                if (data.database > 0 || data.storage > 0) {
                                  (document.getElementById('dbInput') as HTMLInputElement).value = data.database.toFixed(1);
                                  (document.getElementById('storageInput') as HTMLInputElement).value = data.storage.toFixed(1);
                                  alert(`✅ Fetched: Database ${data.database.toFixed(1)} MB, Storage ${data.storage.toFixed(1)} MB`);
                                } else {
                                  window.open('https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage', '_blank');
                                  alert('Could not auto-fetch. Opened dashboard - please copy values and paste below.');
                                }
                              } catch (error) {
                                window.open('https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage', '_blank');
                                alert('Opened dashboard - please check usage and enter below.');
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm shadow-md hover:shadow-lg whitespace-nowrap"
                          >
                            🔄 Try Auto-Fetch
                          </button>
                        </div>
                        
                        <div className="bg-white rounded-lg p-5 border border-gray-200 mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                💾 Database Size
                                <span className="text-xs font-normal text-gray-500 block mt-0.5">Current: {supabaseUsage.database.toFixed(1)} MB</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  id="dbInput"
                                  step="0.1"
                                  min="0"
                                  max="500"
                                  placeholder={supabaseUsage.database > 0 ? supabaseUsage.database.toFixed(1) : "0.0"}
                                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                />
                                <span className="absolute right-3 top-3 text-xs text-gray-400">MB</span>
                              </div>
                              <p className="text-xs text-gray-500">Limit: 500 MB (Free tier)</p>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                📦 Storage
                                <span className="text-xs font-normal text-gray-500 block mt-0.5">Current: {supabaseUsage.storage.toFixed(1)} MB</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  id="storageInput"
                                  step="0.1"
                                  min="0"
                                  max="1024"
                                  placeholder={supabaseUsage.storage > 0 ? supabaseUsage.storage.toFixed(1) : "0.0"}
                                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                />
                                <span className="absolute right-3 top-3 text-xs text-gray-400">MB</span>
                              </div>
                              <p className="text-xs text-gray-500">Limit: 1 GB (Free tier)</p>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                🌐 Bandwidth
                                <span className="text-xs font-normal text-gray-500 block mt-0.5">Current: {supabaseUsage.bandwidth.toFixed(2)} GB</span>
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  id="bandwidthInput"
                                  step="0.01"
                                  min="0"
                                  max="2"
                                  placeholder={supabaseUsage.bandwidth > 0 ? supabaseUsage.bandwidth.toFixed(2) : "0.00"}
                                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                                />
                                <span className="absolute right-3 top-3 text-xs text-gray-400">GB</span>
                              </div>
                              <p className="text-xs text-gray-500">Limit: 2 GB/month (Free tier)</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <button
                            onClick={updateSupabaseUsage}
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center gap-2"
                          >
                            💾 Save All Data
                          </button>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span id="supabaseLastUpdate" className="text-xs text-gray-500"></span>
                            <a
                              href="https://supabase.com/dashboard/project/kanhbrdiagogexsyfkkl/settings/usage"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 hover:underline text-xs"
                            >
                              Open Dashboard →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* fal.ai Usage Monitoring - Full Section */}
                  {service.name === "fal.ai" && (
                    <div className="mt-4 space-y-4">
                      {/* Header with Action Buttons */}
                      <div className="flex justify-between items-center flex-wrap gap-3 pb-3 border-b-2 border-gray-300 mb-4">
                        <h5 className="text-xl font-bold text-gray-900">
                          💰 Usage & Balance Monitoring
                        </h5>
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => openUrl("https://fal.ai/dashboard/billing")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                          >
                            💳 Add Funds / Pay
                          </button>
                          <button
                            onClick={() => openUrl("https://fal.ai/dashboard")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                          >
                            📊 View Dashboard
                          </button>
                        </div>
                      </div>

                      {/* Balance Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Current Balance</p>
                          <p className="text-2xl font-bold text-blue-700">
                            ${falUsage.balance.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Today's Usage</p>
                          <p className="text-2xl font-bold text-amber-700">
                            ${falUsage.todayUsage.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">This Month</p>
                          <p className="text-2xl font-bold text-gray-700">
                            ${falUsage.monthUsage.toFixed(2)}
                          </p>
                        </div>
                        {falUsage.balance <= falUsage.alertThreshold && (
                          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                            <p className="text-sm text-red-600">⚠️ Alert</p>
                            <p className="text-lg font-bold text-red-700">Low Balance!</p>
                          </div>
                        )}
                      </div>

                      {/* Daily Usage Chart */}
                      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-6">
                        <h6 className="text-xl font-semibold text-gray-900 mb-4">
                          Daily Usage (Last 7 Days)
                        </h6>
                        <canvas id="usageChart" style={{ maxHeight: "400px" }}></canvas>
                      </div>

                      {/* Balance Check Helper */}
                      <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300 mb-4">
                        <h6 className="text-lg font-semibold text-amber-900 mb-3">
                          📋 How to Update Your Balance
                        </h6>
                        <p className="text-sm text-amber-800 mb-3">
                          <strong>Note:</strong> fal.ai doesn't provide a public API for balance, so manual entry is required.
                        </p>
                        <div className="bg-white p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Quick Steps:</p>
                          <ol className="text-sm text-gray-600 ml-5 list-decimal space-y-1">
                            <li>Click the button below to open your fal.ai billing page</li>
                            <li>Check your current balance and usage</li>
                            <li>Enter the values in the "Manual Update" section below</li>
                            <li>Click "Update Data" to save</li>
                          </ol>
                        </div>
                        <div className="flex flex-wrap gap-3 items-center">
                          <button
                            onClick={() => openUrl("https://fal.ai/dashboard/billing")}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                          >
                            🔗 Open fal.ai Billing Page
                          </button>
                          <button
                            onClick={() => openUrl("https://fal.ai/dashboard/keys")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
                          >
                            🔑 Manage API Keys
                          </button>
                        </div>
                      </div>

                      {/* Manual Update */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-200 shadow-sm mb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                          <div>
                            <h6 className="text-lg font-semibold text-gray-900 mb-1">
                              💵 Quick Update
                            </h6>
                            <p className="text-sm text-gray-600">
                              Enter your current balance and usage
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch('/api/fal/balance');
                                const data = await response.json();
                                if (!data.manualEntry && data.balance !== undefined) {
                                  (document.getElementById('balanceInput') as HTMLInputElement).value = data.balance.toFixed(2);
                                  (document.getElementById('todayInput') as HTMLInputElement).value = (data.todayUsage || 0).toFixed(2);
                                  (document.getElementById('monthInput') as HTMLInputElement).value = (data.monthUsage || 0).toFixed(2);
                                  alert('✅ Balance fetched! Click "Save All Data" to save.');
                                } else {
                                  window.open('https://fal.ai/dashboard/billing', '_blank');
                                  alert('Could not auto-fetch. Opened billing page - please copy values and paste below.');
                                }
                              } catch (error) {
                                window.open('https://fal.ai/dashboard/billing', '_blank');
                                alert('Opened billing page - please check balance and enter below.');
                              }
                            }}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm shadow-md hover:shadow-lg whitespace-nowrap"
                          >
                            🔄 Try Auto-Fetch
                          </button>
                        </div>
                        
                        <div className="bg-white rounded-lg p-5 border border-gray-200 mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4">
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                💰 Current Balance
                                <span className="text-xs font-normal text-gray-500 block mt-0.5">Current: ${falUsage.balance.toFixed(2)}</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder={falUsage.balance > 0 ? falUsage.balance.toFixed(2) : "0.00"}
                                  id="balanceInput"
                                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                📅 Today's Usage
                                <span className="text-xs font-normal text-gray-500 block mt-0.5">Current: ${falUsage.todayUsage.toFixed(2)}</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder={falUsage.todayUsage > 0 ? falUsage.todayUsage.toFixed(2) : "0.00"}
                                  id="todayInput"
                                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">
                                📊 This Month
                                <span className="text-xs font-normal text-gray-500 block mt-0.5">Current: ${falUsage.monthUsage.toFixed(2)}</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">$</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder={falUsage.monthUsage > 0 ? falUsage.monthUsage.toFixed(2) : "0.00"}
                                  id="monthInput"
                                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              ⚠️ Low Balance Alert Threshold
                            </label>
                            <div className="relative w-48">
                              <span className="absolute left-3 top-3 text-gray-400">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={falUsage.alertThreshold}
                                onChange={(e) =>
                                  saveFalUsage({
                                    alertThreshold: parseFloat(e.target.value) || 10.0,
                                  })
                                }
                                className="w-full pl-8 pr-4 py-2.5 border-2 border-gray-300 rounded-lg text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Alert when balance drops below this amount</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            const balance =
                              parseFloat(
                                (document.getElementById("balanceInput") as HTMLInputElement)
                                  ?.value
                              ) || falUsage.balance;
                            const today =
                              parseFloat(
                                (document.getElementById("todayInput") as HTMLInputElement)
                                  ?.value
                              ) || falUsage.todayUsage;
                            const month =
                              parseFloat(
                                (document.getElementById("monthInput") as HTMLInputElement)
                                  ?.value
                              ) || falUsage.monthUsage;
                            const now = new Date().toISOString().split("T")[0];
                            const newHistory = [
                              { date: now, usage: today, balance },
                              ...falUsage.history.slice(0, 29),
                            ];
                            const newDailyUsage = [...falUsage.dailyUsage];
                            newDailyUsage.shift();
                            newDailyUsage.push(today);
                            saveFalUsage({
                              balance,
                              todayUsage: today,
                              monthUsage: month,
                              history: newHistory,
                              dailyUsage: newDailyUsage,
                            });
                            (
                              document.getElementById("balanceInput") as HTMLInputElement
                            ).value = "";
                            (
                              document.getElementById("todayInput") as HTMLInputElement
                            ).value = "";
                            (
                              document.getElementById("monthInput") as HTMLInputElement
                            ).value = "";
                            alert('✅ Data saved successfully!');
                          }}
                          className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          💾 Save All Data
                        </button>
                      </div>

                      {/* Usage History */}
                      <div>
                        <h6 className="text-lg font-semibold text-gray-900 mb-3">
                          Recent Usage History
                        </h6>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b-2 border-gray-200">
                                <th className="text-left p-2">Date</th>
                                <th className="text-right p-2">Usage</th>
                                <th className="text-right p-2">Balance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {falUsage.history.length === 0 ? (
                                <tr>
                                  <td colSpan={3} className="p-4 text-center text-gray-500">
                                    No data yet
                                  </td>
                                </tr>
                              ) : (
                                falUsage.history.slice(0, 7).map((item, idx) => (
                                  <tr
                                    key={idx}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                  >
                                    <td className="p-2 text-gray-600">{item.date}</td>
                                    <td className="p-2 text-right text-gray-600">
                                      ${item.usage.toFixed(2)}
                                    </td>
                                    <td className="p-2 text-right text-gray-600">
                                      ${item.balance.toFixed(2)}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Categorized Analytics Charts */}
                  <div className="mt-6 space-y-4">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-gray-300">📊 Analytics & Charts</h5>
                    
                    {/* Usage Trends */}
                    <div className="space-y-2">
                      <h6 className="text-base font-semibold text-gray-700">📈 Usage Trends (Last 7 Days)</h6>
                      <div className="h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs border-2 border-gray-200">
                        {service.name === "Supabase" || service.name === "fal.ai" 
                          ? "Line Chart: Daily usage over time - Update data above to see trends"
                          : "Line Chart: Coming Soon - Configure service to enable"
                        }
                        <canvas id={`usageChart-${idx}`} className="hidden"></canvas>
                      </div>
                    </div>

                    {/* Cost Analysis */}
                    <div className="space-y-2">
                      <h6 className="text-base font-semibold text-gray-700">💰 Cost Analysis</h6>
                      <div className="h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs border-2 border-gray-200">
                        {service.name === "fal.ai" || service.name === "Stripe"
                          ? "Bar Chart: Monthly spending breakdown - Update data to see trends"
                          : "Bar Chart: Coming Soon - Configure service to enable"
                        }
                        <canvas id={`costChart-${idx}`} className="hidden"></canvas>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-2">
                      <h6 className="text-base font-semibold text-gray-700">⚡ Performance Metrics</h6>
                      <div className="h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs border-2 border-gray-200">
                        {service.name === "Supabase" || service.name === "Vercel"
                          ? "Area Chart: Response times, uptime, and performance - Update data to see trends"
                          : "Area Chart: Coming Soon - Configure service to enable"
                        }
                        <canvas id={`performanceChart-${idx}`} className="hidden"></canvas>
                      </div>
                    </div>

                    {/* Growth Trends */}
                    <div className="space-y-2">
                      <h6 className="text-base font-semibold text-gray-700">📊 Growth Trends</h6>
                      <div className="h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs border-2 border-gray-200">
                        {service.name === "Supabase" || service.name === "fal.ai"
                          ? "Stacked Area Chart: User growth, API calls, data growth - Update data to see trends"
                          : "Stacked Area Chart: Coming Soon - Configure service to enable"
                        }
                        <canvas id={`growthChart-${idx}`} className="hidden"></canvas>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      💡 Update service details as you configure each service
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => openUrl("https://github.com")}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg font-medium"
            >
              Open GitHub
            </button>
            <button
              onClick={() => openUrl("https://supabase.com/dashboard")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium"
            >
              Open Supabase
            </button>
            <button
              onClick={() => openUrl("https://dashboard.stripe.com")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-medium"
            >
              Open Stripe
            </button>
            <button
              onClick={() => openUrl("https://vercel.com/dashboard")}
              className="bg-black hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-medium"
            >
              Open Vercel
            </button>
            <button
              onClick={() => {
                window.open('https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin', '_blank');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium"
            >
              📧 Gmail Login
            </button>
            <Link
              href="/"
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-lg font-medium text-center block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

