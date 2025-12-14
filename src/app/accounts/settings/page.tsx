"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();
      
      if (error) {
        router.push("/auth/login");
        return;
      }

      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/auth/login");
      }
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Error signing out");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      setError("Please type 'DELETE' to confirm");
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      // Call the API route to delete the account (uses service role key)
      const response = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out and redirect
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push("/?message=Account deleted successfully");
    } catch (err: any) {
      setError(err.message || "Error deleting account. Please contact support.");
      setDeleteLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/accounts"
            className="text-amber-600 hover:text-amber-700 font-medium mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user?.email || "Not available"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-gray-900">{user?.user_metadata?.name || "Not set"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Created
              </label>
              <p className="text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full md:w-auto px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">Danger Zone</h2>
          
          {!showDeleteConfirm ? (
            <div>
              <p className="text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition shadow-lg"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-700 font-semibold">
                This action cannot be undone. This will permanently delete your account and all associated data.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-red-900 mb-2">
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="DELETE"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || deleteConfirmText !== "DELETE"}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition shadow-lg"
                >
                  {deleteLoading ? "Deleting..." : "Confirm Delete"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setError(null);
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
