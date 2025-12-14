"use client";

import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              At Fur and Fame, we want you to be completely satisfied with your AI-generated pet portraits. 
              We stand behind the quality of our service and are committed to resolving any issues you may encounter.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Eligibility</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">✅ You May Be Eligible for a Refund If:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your portraits failed to generate due to a technical error on our part</li>
              <li>The generated portraits are significantly different from what was described</li>
              <li>You experience a service interruption that prevents portrait generation</li>
              <li>You contact us within 7 days of purchase with a valid concern</li>
              <li>You have not yet downloaded or used the generated portraits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">❌ Refunds Are Not Available For:</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Portraits that have been successfully generated and downloaded</li>
              <li>Change of mind after receiving your portraits</li>
              <li>Portraits that don't match your personal preferences (but were generated correctly)</li>
              <li>Issues caused by low-quality or inappropriate source photos</li>
              <li>Requests made more than 7 days after purchase</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
              <p className="text-gray-700 font-semibold mb-2">Step 1: Contact Us</p>
              <p className="text-gray-600 text-sm">
                Reach out to our support team within 7 days of purchase using our{" "}
                <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">
                  contact form
                </Link>{" "}
                or email. Please include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 text-sm mt-2 space-y-1">
                <li>Your order number or transaction ID</li>
                <li>Description of the issue</li>
                <li>Screenshots or details about what went wrong</li>
              </ul>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-gray-700 font-semibold mb-2">Step 2: Review</p>
              <p className="text-gray-600 text-sm">
                Our team will review your request within 24-48 hours. We may ask for additional 
                information or clarification.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-gray-700 font-semibold mb-2">Step 3: Resolution</p>
              <p className="text-gray-600 text-sm">
                If your request is approved, we will process your refund within 5-10 business days. 
                The refund will be issued to the original payment method.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alternative Solutions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Before requesting a refund, we may offer alternative solutions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Regeneration:</strong> We can regenerate your portraits at no additional cost if the initial generation had issues</li>
              <li><strong>Style Adjustment:</strong> We can modify styles or backgrounds if you're not satisfied with the initial result</li>
              <li><strong>Partial Refund:</strong> In some cases, we may offer a partial refund while keeping the service active</li>
              <li><strong>Credit:</strong> We may offer account credit for future purchases instead of a refund</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Time</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Request Review:</strong> 24-48 hours</li>
              <li><strong>Refund Processing:</strong> 5-10 business days after approval</li>
              <li><strong>Payment Method Credit:</strong> Additional 3-5 business days (depends on your bank/card issuer)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Total time from request to funds appearing in your account: typically 8-15 business days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Issues</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you experience technical issues during portrait generation:
            </p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Take a screenshot of any error messages</li>
              <li>Note the time and date of the issue</li>
              <li>Contact support immediately with these details</li>
              <li>We will investigate and either fix the issue or provide a full refund</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disputes and Chargebacks</h2>
            <p className="text-gray-700 leading-relaxed">
              We encourage you to contact us directly before initiating a chargeback with your bank or credit card company. 
              Chargebacks can result in additional fees and may affect your ability to use our services in the future. 
              We're committed to resolving issues fairly and quickly through direct communication.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For refund requests or questions about this policy, please contact us:
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Fur and Fame</strong><br />
              Timberline Collective LLC<br />
              Email: <Link href="/contact" className="text-amber-600 hover:text-amber-700">Contact Support</Link><br />
              Website: <a href="https://www.furandfame.com" className="text-amber-600 hover:text-amber-700">www.furandfame.com</a>
            </p>
          </section>
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
