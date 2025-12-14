"use client";

import { useState } from "react";
import Link from "next/link";
import { validateUserContent } from "@/lib/content-moderation";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate content moderation
    const nameValidation = validateUserContent(formData.name, "name");
    if (!nameValidation.isValid) {
      setError(nameValidation.error || "Your name contains inappropriate content.");
      return;
    }

    const messageValidation = validateUserContent(formData.message, "message");
    if (!messageValidation.isValid) {
      setError(messageValidation.error || "Your message contains inappropriate content.");
      return;
    }

    // In a real implementation, this would send an email or create a support ticket
    // For now, we'll just show a success message
    setSubmitted(true);
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            We're here to help! Get in touch with our support team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📧 Email Support</h3>
                <p className="text-gray-600">
                  For questions, support, or feedback, send us an email using the form or contact us directly.
                </p>
                <p className="text-amber-600 font-medium mt-2">
                  ccates.timberlinecollective@gmail.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">⏰ Response Time</h3>
                <p className="text-gray-600">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">💬 Common Questions</h3>
                <p className="text-gray-600 mb-2">
                  Before contacting us, you might find answers in our FAQ:
                </p>
                <Link
                  href="/faq"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  View FAQ →
                </Link>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📋 Business Information</h3>
                <p className="text-gray-600">
                  <strong>Fur and Fame</strong><br />
                  Timberline Collective LLC<br />
                  Oregon, United States
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            
            {submitted ? (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-green-700">
                  We've received your message and will get back to you soon.
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
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select a subject...</option>
                    <option value="support">Technical Support</option>
                    <option value="refund">Refund Request</option>
                    <option value="question">General Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition shadow-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/faq"
              className="text-center p-4 bg-white rounded-lg hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">❓</div>
              <div className="font-semibold text-gray-900">FAQ</div>
              <div className="text-sm text-gray-600">Common questions</div>
            </Link>
            <Link
              href="/terms"
              className="text-center p-4 bg-white rounded-lg hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">📜</div>
              <div className="font-semibold text-gray-900">Terms of Service</div>
              <div className="text-sm text-gray-600">Legal terms</div>
            </Link>
            <Link
              href="/privacy"
              className="text-center p-4 bg-white rounded-lg hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-semibold text-gray-900">Privacy Policy</div>
              <div className="text-sm text-gray-600">Data protection</div>
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
