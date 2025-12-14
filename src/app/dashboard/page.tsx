"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase-client";
import Link from "next/link";

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      
      if (error || !currentUser) {
        router.push("/auth/login");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    } catch (err) {
      router.push("/auth/login");
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      console.error("Error signing out:", err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-amber-900">Fur & Fame</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/account"
                className="flex items-center gap-2 text-gray-700 hover:text-amber-600 font-medium"
              >
                <span className="text-lg">👤</span>
                <span>My Account</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Your Dashboard</h2>
          <p className="text-gray-600">Create beautiful AI portraits of your pets and loved ones</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/create"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">🎨</div>
              <h3 className="text-xl font-semibold text-amber-900">Create Portrait</h3>
            </div>
            <p className="text-gray-600">
              Generate beautiful AI portraits of your pets or loved ones
            </p>
          </Link>

          <Link
            href="/variants"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">🖼️</div>
              <h3 className="text-xl font-semibold text-amber-900">My Portraits</h3>
            </div>
            <p className="text-gray-600">
              View and download your generated portraits
            </p>
          </Link>

          <Link
            href="/accounts/settings"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">⚙️</div>
              <h3 className="text-xl font-semibold text-amber-900">Account Settings</h3>
            </div>
            <p className="text-gray-600">
              Manage your account and preferences
            </p>
          </Link>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-amber-900 mb-4">Account Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-900">{user?.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Account Created:</span>
              <span className="ml-2 text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
