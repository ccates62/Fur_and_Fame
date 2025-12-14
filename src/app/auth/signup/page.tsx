"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validateUserContent } from "@/lib/content-moderation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate content moderation
    const nameValidation = validateUserContent(formData.name, "name");
    if (!nameValidation.isValid) {
      setError(nameValidation.error || "Invalid name");
      setLoading(false);
      return;
    }

    // Basic validation
    if (!formData.email || !formData.password || !formData.name) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();

      // Sign up user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: nameValidation.filteredText || formData.name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setSuccess(true);
        // Redirect to login or dashboard after 2 seconds
        setTimeout(() => {
          router.push("/auth/login?message=Account created successfully. Please check your email to verify your account.");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl font-bold text-amber-600">🐾</span>
              <span className="text-2xl font-bold text-gray-900">Fur & Fame</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Sign up to save your portraits and track orders</p>
          </div>

          {success ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-green-900 mb-2">
                Account Created!
              </h2>
              <p className="text-green-700 mb-4">
                Please check your email to verify your account before signing in.
              </p>
              <p className="text-sm text-green-600">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="At least 8 characters"
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition shadow-lg"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By creating an account, you agree to our</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="text-amber-600 hover:text-amber-700">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="text-amber-600 hover:text-amber-700">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
