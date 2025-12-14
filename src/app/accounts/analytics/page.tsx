"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";

interface ServiceUsage {
  name: string;
  icon: string;
  cost: number;
  usage: number;
  limit: number;
  unit: string;
  trend: "up" | "down" | "stable";
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
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
  const [taxRecords, setTaxRecords] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [progressData, setProgressData] = useState({
    legal: { completed: 1, total: 3, percentage: 33 },
    payment: { completed: 0, total: 2, percentage: 0 },
    setup: { completed: 3, total: 5, percentage: 60 },
    integration: { completed: 4, total: 4, percentage: 100 },
    marketing: { completed: 0, total: 1, percentage: 0 },
    other: { completed: 0, total: 1, percentage: 0 },
  });

  // Load data from localStorage
  useEffect(() => {
    // Load fal.ai usage
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

    // Load Supabase usage
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

    // Load tax records for cost calculation
    const taxSaved = localStorage.getItem("taxRecords");
    if (taxSaved) {
      try {
        const records = JSON.parse(taxSaved);
        setTaxRecords(Array.isArray(records) ? records : []);
      } catch (e) {
        console.error("Error loading tax records:", e);
      }
    }

    // Load sales data
    const salesSaved = localStorage.getItem("salesData");
    if (salesSaved) {
      try {
        const salesData = JSON.parse(salesSaved);
        setSales(Array.isArray(salesData) ? salesData : []);
      } catch (e) {
        console.error("Error loading sales data:", e);
      }
    }

    // Load progress data
    const progressSaved = localStorage.getItem("furAndFameProgress");
    if (progressSaved) {
      try {
        const phases = JSON.parse(progressSaved);
        // Calculate progress by category
        const categoryCounts: any = {
          legal: { completed: 0, total: 0 },
          payment: { completed: 0, total: 0 },
          setup: { completed: 0, total: 0 },
          integration: { completed: 0, total: 0 },
          marketing: { completed: 0, total: 0 },
          other: { completed: 0, total: 0 },
        };
        // This would need to match your milestone categories
        // For now, using default values
      } catch (e) {
        console.error("Error loading progress:", e);
      }
    }
  }, []);

  // Calculate monthly costs from tax records
  const calculateMonthlyCosts = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const monthlyData = months.map((month, index) => {
      const monthRecords = taxRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === index && recordDate.getFullYear() === currentYear;
      });
      const cost = monthRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
      return { month, cost };
    });
    return monthlyData;
  };

  const monthlyCosts = calculateMonthlyCosts();

  // Build services array with real data
  const services: ServiceUsage[] = [
    {
      name: "Supabase",
      icon: "🔐",
      cost: 0,
      usage: supabaseUsage.database,
      limit: 500,
      unit: "MB",
      trend: supabaseUsage.database > 400 ? "up" : "stable",
    },
    {
      name: "fal.ai",
      icon: "🤖",
      cost: falUsage.monthUsage,
      usage: Math.round(falUsage.monthUsage * 10), // Approximate images based on cost
      limit: 100,
      unit: "images",
      trend: falUsage.monthUsage > 5 ? "up" : "stable",
    },
    {
      name: "Stripe",
      icon: "💳",
      cost: 0,
      usage: 0,
      limit: 0,
      unit: "transactions",
      trend: "stable",
    },
    {
      name: "Printful",
      icon: "📦",
      cost: 0,
      usage: 0,
      limit: 0,
      unit: "orders",
      trend: "stable",
    },
    {
      name: "Resend",
      icon: "📧",
      cost: 0,
      usage: 12,
      limit: 100,
      unit: "emails/day",
      trend: "stable",
    },
    {
      name: "Vercel",
      icon: "🚀",
      cost: 0,
      usage: supabaseUsage.bandwidth,
      limit: 100,
      unit: "GB bandwidth",
      trend: supabaseUsage.bandwidth > 1.5 ? "up" : "stable",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Chart) {
      renderCharts();
    }
  }, [selectedPeriod, services, monthlyCosts, progressData]);

  const renderCharts = () => {
    const Chart = (window as any).Chart;

    // Cost Over Time Chart
    const costCtx = document.getElementById("costChart") as HTMLCanvasElement;
    if (costCtx) {
      const existingChart = Chart.getChart(costCtx);
      if (existingChart) existingChart.destroy();

      new Chart(costCtx, {
        type: "line",
        data: {
          labels: monthlyCosts.map((m) => m.month),
          datasets: [
            {
              label: "Monthly Cost ($)",
              data: monthlyCosts.map((m) => m.cost),
              borderColor: "#f59e0b",
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: "Monthly Costs Over Time" },
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
    }

    // Service Usage Comparison
    const usageCtx = document.getElementById("usageChart") as HTMLCanvasElement;
    if (usageCtx) {
      const existingChart = Chart.getChart(usageCtx);
      if (existingChart) existingChart.destroy();

      new Chart(usageCtx, {
        type: "bar",
        data: {
          labels: services.map((s) => s.name),
          datasets: [
            {
              label: "Usage",
              data: services.map((s) => s.usage),
              backgroundColor: services.map((s) => {
                const percent = s.limit > 0 ? (s.usage / s.limit) * 100 : 0;
                if (percent >= 80) return "#ef4444";
                if (percent >= 60) return "#f59e0b";
                return "#3b82f6";
              }),
            },
            {
              label: "Limit",
              data: services.map((s) => s.limit),
              backgroundColor: "rgba(156, 163, 175, 0.3)",
              borderColor: "#9ca3af",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            title: { display: true, text: "Service Usage vs Limits" },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }

    // Cost Distribution Pie Chart
    const costDistCtx = document.getElementById("costDistributionChart") as HTMLCanvasElement;
    if (costDistCtx) {
      const existingChart = Chart.getChart(costDistCtx);
      if (existingChart) existingChart.destroy();

      const costData = services.filter((s) => s.cost > 0);
      new Chart(costDistCtx, {
        type: "doughnut",
        data: {
          labels: costData.map((s) => s.name),
          datasets: [
            {
              data: costData.map((s) => s.cost),
              backgroundColor: [
                "#f59e0b",
                "#3b82f6",
                "#10b981",
                "#ef4444",
                "#8b5cf6",
                "#ec4899",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "right" },
            title: { display: true, text: "Cost Distribution by Service" },
          },
        },
      });
    }

    // Progress by Category
    const progressCtx = document.getElementById("progressChart") as HTMLCanvasElement;
    if (progressCtx) {
      const existingChart = Chart.getChart(progressCtx);
      if (existingChart) existingChart.destroy();

      new Chart(progressCtx, {
        type: "bar",
        data: {
          labels: Object.keys(progressData).map((k) => k.charAt(0).toUpperCase() + k.slice(1)),
          datasets: [
            {
              label: "Completion %",
              data: Object.values(progressData).map((p) => p.percentage),
              backgroundColor: [
                "#3b82f6",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
                "#ef4444",
                "#ec4899",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: true, text: "Progress by Category" },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value: any) {
                  return value + "%";
                },
              },
            },
          },
        },
      });
    }

    // Sales vs Costs Chart
    const salesVsCostsCtx = document.getElementById("salesVsCostsChart") as HTMLCanvasElement;
    if (salesVsCostsCtx) {
      const existingChart = Chart.getChart(salesVsCostsCtx);
      if (existingChart) existingChart.destroy();

      // Group sales and costs by month
      const salesByMonth: { [key: string]: number } = {};
      const costsByMonth: { [key: string]: number } = {};

      // Process sales
      sales.forEach((sale: any) => {
        const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        salesByMonth[month] = (salesByMonth[month] || 0) + sale.amount;
      });

      // Process costs from tax records
      taxRecords.forEach((record: any) => {
        const month = new Date(record.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        costsByMonth[month] = (costsByMonth[month] || 0) + record.amount;
      });

      // Get all unique months
      const allMonths = Array.from(new Set([...Object.keys(salesByMonth), ...Object.keys(costsByMonth)])).sort((a, b) => {
        return new Date(a).getTime() - new Date(b).getTime();
      });

      // If no data, use last 6 months
      if (allMonths.length === 0) {
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(today);
          date.setMonth(date.getMonth() - i);
          allMonths.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        }
      }

      const salesData = allMonths.map(month => salesByMonth[month] || 0);
      const costsData = allMonths.map(month => costsByMonth[month] || 0);
      const profitData = allMonths.map((_, i) => salesData[i] - costsData[i]);

      new Chart(salesVsCostsCtx, {
        type: "line",
        data: {
          labels: allMonths,
          datasets: [
            {
              label: "Sales ($)",
              data: salesData,
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.4,
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Costs ($)",
              data: costsData,
              borderColor: "#ef4444",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              tension: 0.4,
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Profit ($)",
              data: profitData,
              borderColor: "#3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
              fill: false,
              borderDash: [5, 5],
              yAxisID: "y",
            },
          ],
        },
        options: {
          responsive: true,
          interaction: {
            mode: "index" as const,
            intersect: false,
          },
          plugins: {
            legend: { display: true },
            title: { display: true, text: "Sales vs Costs Over Time" },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  return context.dataset.label + ": $" + context.parsed.y.toFixed(2);
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return "$" + value.toFixed(2);
                },
              },
            },
          },
        },
      });
    }
  };

  const totalMonthlyCost = services.reduce((sum, s) => sum + s.cost, 0);
  const totalUsage = services.reduce((sum, s) => sum + s.usage, 0);
  
  // Calculate totals
  const totalSales = sales.reduce((sum: number, s: any) => sum + s.amount, 0);
  const totalCosts = taxRecords.reduce((sum: number, r: any) => sum + r.amount, 0);
  const totalProfit = totalSales - totalCosts;
  const overallProgress = Object.values(progressData).reduce((sum, p) => sum + p.percentage, 0) / Object.keys(progressData).length;

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="afterInteractive"
        onLoad={renderCharts}
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  📊 Analytics & Data Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Monitor costs, usage, and progress across all services
                </p>
              </div>
              <Link
                href="/accounts"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 mt-4">
              {(["week", "month", "year"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedPeriod === period
                      ? "bg-amber-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-amber-200">
              <p className="text-sm text-gray-600 mb-1">Total Monthly Cost</p>
              <p className="text-3xl font-bold text-gray-900">${totalMonthlyCost.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">All services combined</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Usage</p>
              <p className="text-3xl font-bold text-gray-900">{totalUsage.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-1">Across all services</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
              <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
              <p className="text-3xl font-bold text-gray-900">{overallProgress.toFixed(0)}%</p>
              <p className="text-xs text-gray-500 mt-1">Launch completion</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Active Services</p>
              <p className="text-3xl font-bold text-gray-900">{services.length}</p>
              <p className="text-xs text-gray-500 mt-1">Configured & running</p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cost Over Time */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Over Time</h2>
              <canvas id="costChart" height="300"></canvas>
            </div>

            {/* Cost Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Distribution</h2>
              <canvas id="costDistributionChart" height="300"></canvas>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Service Usage */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Service Usage vs Limits</h2>
              <canvas id="usageChart" height="300"></canvas>
            </div>

            {/* Progress by Category */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Progress by Category</h2>
              <canvas id="progressChart" height="300"></canvas>
            </div>
          </div>

          {/* Sales vs Costs Chart */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-2 border-gray-200">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">💰 Sales vs Costs Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Total Sales</p>
                  <p className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                  <p className="text-sm text-gray-600 mb-1">Total Costs</p>
                  <p className="text-2xl font-bold text-red-600">${totalCosts.toFixed(2)}</p>
                </div>
                <div className={`rounded-lg p-4 border-2 ${totalProfit >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                  <p className="text-sm text-gray-600 mb-1">Net Profit</p>
                  <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ${totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <canvas id="salesVsCostsChart" height="300"></canvas>
          </div>

          {/* Service Details Table */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Service Usage Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cost</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Usage</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Limit</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Usage %</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => {
                    const usagePercent = service.limit > 0 ? (service.usage / service.limit) * 100 : 0;
                    const statusColor =
                      usagePercent >= 80 ? "text-red-600" : usagePercent >= 60 ? "text-amber-600" : "text-green-600";
                    const statusText =
                      usagePercent >= 80 ? "⚠️ Warning" : usagePercent >= 60 ? "⚡ Moderate" : "✅ Safe";

                    return (
                      <tr key={service.name} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{service.icon}</span>
                            <span className="font-medium text-gray-900">{service.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">${service.cost.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {service.usage} {service.unit}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {service.limit > 0 ? `${service.limit} ${service.unit}` : "Unlimited"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  usagePercent >= 80
                                    ? "bg-red-500"
                                    : usagePercent >= 60
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12">
                              {usagePercent.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className={`py-3 px-4 font-medium ${statusColor}`}>{statusText}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Progress Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(progressData).map(([category, data]) => (
                <div key={category} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
                    <span className="text-sm text-gray-600">
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-amber-600 h-4 rounded-full transition-all"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{data.percentage}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

