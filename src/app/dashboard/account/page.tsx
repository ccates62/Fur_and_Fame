"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase-client";
import Link from "next/link";

interface Order {
  id: string;
  date: string;
  amount: number;
  product: string;
  status: string;
  checkoutSessionId?: string;
}

export default function CustomerAccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "settings">("orders");

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

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

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      
      // Fetch orders from Stripe API (via our backend)
      // The API will use the authenticated user's session
      const response = await fetch("/api/orders/user", {
        credentials: "include", // Include cookies for authentication
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        // If no orders API or error, show empty state
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
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
              <span className="text-2xl font-bold text-amber-900">Fur & Fame</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-amber-600 font-medium"
              >
                Dashboard
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
          <h1 className="text-3xl font-bold text-amber-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your orders and account settings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`${
                activeTab === "orders"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`${
                activeTab === "settings"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Account Settings
            </button>
          </nav>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">Order History</h2>
            
            {ordersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">Start creating beautiful portraits!</p>
                <Link
                  href="/create"
                  className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition"
                >
                  Create Your First Portrait
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.product}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Order #{order.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${order.amount.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Your email address cannot be changed at this time.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Created
                    </label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-gray-900">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/accounts/settings"
                    className="block w-full px-4 py-2 text-left text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  >
                    Manage Account Settings
                  </Link>
                  <Link
                    href="/create"
                    className="block w-full px-4 py-2 text-left text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition"
                  >
                    Create New Portrait
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
