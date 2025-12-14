"use client";

import ProgressTracker from "@/components/ProgressTracker";

export default function ProgressPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Launch Progress Tracker
        </h1>
        <p className="text-gray-600">
          Track your progress through the 7-day launch plan
        </p>
      </div>
      <ProgressTracker />
    </div>
  );
}

