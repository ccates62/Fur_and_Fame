"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

interface Phase {
  id: string;
  name: string;
  steps: {
    id: string;
    name: string;
    completed: boolean;
  }[];
}

const phases: Phase[] = [
  {
    id: "phase1",
    name: "Core E-Commerce Build",
    steps: [
      { id: "1", name: "Project Setup & Landing Page", completed: true },
      { id: "2", name: "Pet Upload & Style Selection", completed: true },
      { id: "3", name: "AI Portrait Generation", completed: true },
      { id: "4", name: "Stripe Checkout Integration", completed: false },
      { id: "5", name: "Printful Order Automation", completed: false },
      { id: "6", name: "Email Automation", completed: false },
      { id: "7", name: "Thank You & Upsell Page", completed: false },
    ],
  },
  {
    id: "phase2",
    name: "Viral Video Generator",
    steps: [
      { id: "8", name: "Video Generation Page", completed: false },
    ],
  },
  {
    id: "phase3",
    name: "Polish & Launch Prep",
    steps: [
      { id: "9", name: "Custom Domain Setup", completed: false },
      { id: "10", name: "SEO & Social Sharing", completed: false },
      { id: "11", name: "Testing & QA", completed: false },
    ],
  },
  {
    id: "phase4",
    name: "Marketing Assets",
    steps: [
      { id: "12", name: "Create Viral Content", completed: false },
    ],
  },
  {
    id: "phase5",
    name: "Launch",
    steps: [
      { id: "13", name: "Switch to Live Stripe", completed: false },
      { id: "14", name: "Launch Ads Campaign", completed: false },
    ],
  },
];

export default function ProgressTracker() {
  const [localPhases, setLocalPhases] = useState<Phase[]>(phases);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("furAndFameProgress");
    if (saved) {
      try {
        const savedPhases = JSON.parse(saved);
        setLocalPhases(savedPhases);
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    }
  }, []);

  // Save progress to localStorage
  const toggleStep = (phaseId: string, stepId: string) => {
    setLocalPhases((prev) => {
      const updated = prev.map((phase) => {
        if (phase.id === phaseId) {
          return {
            ...phase,
            steps: phase.steps.map((step) =>
              step.id === stepId
                ? { ...step, completed: !step.completed }
                : step
            ),
          };
        }
        return phase;
      });
      localStorage.setItem("furAndFameProgress", JSON.stringify(updated));
      return updated;
    });
  };

  // Calculate overall progress
  const totalSteps = localPhases.reduce(
    (sum, phase) => sum + phase.steps.length,
    0
  );
  const completedSteps = localPhases.reduce(
    (sum, phase) =>
      sum + phase.steps.filter((step) => step.completed).length,
    0
  );
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  // Calculate phase progress
  const getPhaseProgress = (phase: Phase) => {
    const completed = phase.steps.filter((step) => step.completed).length;
    return Math.round((completed / phase.steps.length) * 100);
  };

  // Render progress chart
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Chart) {
      const Chart = (window as any).Chart;
      const ctx = document.getElementById("progressChart") as HTMLCanvasElement;
      if (ctx) {
        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: localPhases.map((p) => p.name),
            datasets: [
              {
                data: localPhases.map((p) => getPhaseProgress(p)),
                backgroundColor: [
                  "#f59e0b",
                  "#3b82f6",
                  "#10b981",
                  "#8b5cf6",
                  "#ef4444",
                ],
                borderWidth: 2,
                borderColor: "#ffffff",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  padding: 15,
                  font: { size: 12 },
                },
              },
              title: {
                display: true,
                text: "Progress by Phase",
                font: { size: 16, weight: "bold" },
              },
            },
          },
        });
      }

      // Phase progress bar chart
      const barCtx = document.getElementById("phaseProgressChart") as HTMLCanvasElement;
      if (barCtx) {
        const existingChart = Chart.getChart(barCtx);
        if (existingChart) existingChart.destroy();

        new Chart(barCtx, {
          type: "bar",
          data: {
            labels: localPhases.map((p) => p.name),
            datasets: [
              {
                label: "Completion %",
                data: localPhases.map((p) => getPhaseProgress(p)),
                backgroundColor: localPhases.map((p) => {
                  const progress = getPhaseProgress(p);
                  if (progress === 100) return "#10b981";
                  if (progress > 0) return "#f59e0b";
                  return "#9ca3af";
                }),
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: "Phase Completion Status",
                font: { size: 16, weight: "bold" },
              },
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
    }
  }, [localPhases]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
        strategy="afterInteractive"
      />
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Launch Progress Tracker
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-amber-600">
                {completedSteps}/{totalSteps} Steps ({overallProgress}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {localPhases.map((phase, phaseIdx) => {
          const phaseProgress = getPhaseProgress(phase);
          const isPhaseComplete = phaseProgress === 100;

          return (
            <div
              key={phase.id}
              className="border-2 rounded-lg p-4 transition-all"
              style={{
                borderColor: isPhaseComplete
                  ? "#10b981"
                  : phaseProgress > 0
                  ? "#f59e0b"
                  : "#e5e7eb",
                backgroundColor: isPhaseComplete
                  ? "#f0fdf4"
                  : phaseProgress > 0
                  ? "#fffbeb"
                  : "#f9fafb",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      isPhaseComplete
                        ? "bg-green-500"
                        : phaseProgress > 0
                        ? "bg-amber-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {phaseIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {phase.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {phase.steps.filter((s) => s.completed).length}/
                      {phase.steps.length} steps complete
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-600">
                    {phaseProgress}%
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isPhaseComplete
                          ? "bg-green-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${phaseProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {phase.steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleStep(phase.id, step.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        step.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-amber-500"
                      }`}
                    >
                      {step.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        step.completed
                          ? "text-gray-600 line-through"
                          : "text-gray-900 font-medium"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Progress Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Progress by Phase
          </h3>
          <canvas id="progressChart" height="250"></canvas>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
            Phase Completion Status
          </h3>
          <canvas id="phaseProgressChart" height="250"></canvas>
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>💡 Tip:</strong> Click the checkboxes to track your progress.
          Your progress is saved locally in your browser.
        </p>
      </div>
    </div>
    </>
  );
}

