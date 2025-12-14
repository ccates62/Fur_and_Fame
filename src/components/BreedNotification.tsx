"use client";

import { useState, useEffect, useCallback } from "react";

interface BreedNotificationProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

interface BreedStats {
  totalCount: number;
  byType: {
    dog: number;
    cat: number;
    other: number;
  };
  recentBreeds: Array<{
    name: string;
    petType: string;
    submittedAt: string;
    usageCount: number;
  }>;
}

export default function BreedNotification({ enabled = true, onToggle }: BreedNotificationProps) {
  const [lastKnownCount, setLastKnownCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    breed: string;
    petType: string;
    timestamp: string;
  }>>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [stats, setStats] = useState<BreedStats | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component only runs on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Poll for new breeds every 10 seconds
  const checkForNewBreeds = useCallback(async () => {
    // Safety checks
    if (!mounted) return;
    if (typeof window === "undefined") return;
    if (!enabled || isPolling) return;

    setIsPolling(true);
    try {
      const response = await fetch("/api/breeds/list");
      if (!response.ok) {
        setIsPolling(false);
        return;
      }

      const data = await response.json();
      const currentCount = data.totalCount || 0;

      // Check if there are new breeds
      if (lastKnownCount > 0 && currentCount > lastKnownCount) {
        // Get all breeds to find the new ones
        const allBreeds = data.allBreeds || [];
        const newBreeds = allBreeds
          .filter((breed: any) => {
            try {
              // Check if this breed was submitted recently (within last 2 minutes)
              const submittedAt = new Date(breed.submittedAt);
              const now = new Date();
              const diffMinutes = (now.getTime() - submittedAt.getTime()) / (1000 * 60);
              return diffMinutes <= 2;
            } catch {
              return false;
            }
          })
          .sort((a: any, b: any) => {
            try {
              return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
            } catch {
              return 0;
            }
          });

        // Create notifications for new breeds
        newBreeds.forEach((breed: any) => {
          const notificationId = `${breed.name}-${breed.submittedAt}`;
          
          // Use functional update to avoid dependency on notifications
          setNotifications((prev) => {
            const exists = prev.some((n) => n.id === notificationId);
            if (!exists) {
              // Show browser notification if permission granted (with error handling)
              if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                try {
                  new Notification(`✨ New Breed Added: ${breed.name}`, {
                    body: `A new ${breed.petType} breed "${breed.name}" was just added to the system!`,
                    icon: "/favicon.ico",
                    tag: notificationId,
                  });
                } catch (err) {
                  // Silently fail if notification creation fails
                  console.log("Notification creation failed:", err);
                }
              }
              return [
                {
                  id: notificationId,
                  breed: breed.name,
                  petType: breed.petType,
                  timestamp: breed.submittedAt,
                },
                ...prev,
              ].slice(0, 10); // Keep only last 10 notifications
            }
            return prev;
          });
        });
      }

      setLastKnownCount(currentCount);
      const breedsList = data.allBreeds || [];
      setStats({
        totalCount: currentCount,
        byType: data.byType || { dog: 0, cat: 0, other: 0 },
        recentBreeds: breedsList
          .sort((a: any, b: any) => {
            try {
              return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
            } catch {
              return 0;
            }
          })
          .slice(0, 5),
      });
    } catch (error) {
      console.error("Error checking for new breeds:", error);
      // Don't crash on error, just log it
    } finally {
      setIsPolling(false);
    }
  }, [enabled, isPolling, lastKnownCount, mounted]);

  // Request notification permission on mount (client-side only)
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {
        // Silently fail if permission denied
      });
    }
  }, [mounted]);

  // Poll for new breeds
  useEffect(() => {
    if (!mounted) return;
    if (!enabled) return;
    if (typeof window === "undefined") return;

    // Initial check (with delay to ensure page is loaded)
    const initialTimeout = setTimeout(() => {
      checkForNewBreeds();
    }, 2000); // 2 second delay to ensure everything is loaded

    // Set up polling interval (every 10 seconds)
    const interval = setInterval(() => {
      checkForNewBreeds();
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [enabled, checkForNewBreeds, mounted]);

  // Remove notification after 10 seconds
  useEffect(() => {
    if (!mounted) return;
    
    const timers = notifications.map((notification) => {
      return setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 10000); // 10 seconds
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, mounted]);

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffSeconds < 60) return "just now";
      if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
      return date.toLocaleTimeString();
    } catch {
      return "recently";
    }
  };

  const getPetTypeEmoji = (petType: string) => {
    switch (petType) {
      case "dog": return "🐕";
      case "cat": return "🐱";
      case "other": return "🐾";
      default: return "🐾";
    }
  };

  // Don't render anything until mounted (prevents SSR issues)
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40 max-w-xs w-auto space-y-2">
      {/* Notification Toggle - Compact */}
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-amber-200 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base">🔔</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-700 truncate">Breed Notifications</p>
            {!isMinimized && (
              <p className="text-xs text-gray-500 truncate">
                {enabled ? "Active" : "Disabled"} • {stats?.totalCount || 0} breeds
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xs px-1"
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? "▼" : "▲"}
            </button>
          )}
          <button
            onClick={() => onToggle?.(!enabled)}
            className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
              enabled
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {enabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Active Notifications - Only show if not minimized */}
      {!isMinimized && notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400 rounded-lg shadow-lg p-4 animate-slide-in"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{getPetTypeEmoji(notification.petType)}</span>
                <p className="font-bold text-amber-900">New Breed Added!</p>
              </div>
              <p className="text-sm text-gray-700 font-semibold">
                {notification.breed}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(notification.timestamp)} • {notification.petType}
              </p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
