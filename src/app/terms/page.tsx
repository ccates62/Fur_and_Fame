"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last Updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using Fur and Fame ("we," "us," or "our") services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Fur and Fame is operated by Timberline Collective LLC, a Limited Liability Company registered in Oregon, United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Fur and Fame provides AI-powered pet portrait generation services. We use artificial intelligence to create artistic portraits of pets and people based on uploaded photographs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our services include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
              <li>AI-generated pet portraits in various artistic styles</li>
              <li>Digital download of generated portraits</li>
              <li>Portrait customization options (styles, backgrounds, layouts)</li>
              <li>Multi-subject portrait generation (multiple pets or pets with people)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide accurate and truthful information when using our services</li>
              <li>Upload only photographs that you own or have permission to use</li>
              <li>Not upload inappropriate, offensive, or illegal content</li>
              <li>Not use our services for any unlawful purpose</li>
              <li>Not attempt to reverse engineer, copy, or replicate our AI technology</li>
              <li>Not use automated systems to access our services without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Your Photos:</strong> You retain all rights to photographs you upload. By uploading photos, you grant us a license to use them solely for generating your portraits and providing our services.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Generated Portraits:</strong> Once you purchase a portrait, you receive a license to use the generated portrait for personal or commercial purposes. However, you may not resell our AI generation service or claim the AI technology as your own.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Our Technology:</strong> All AI technology, algorithms, and platform features remain the property of Fur and Fame and Timberline Collective LLC.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment and Pricing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All prices are displayed in USD. Payment is required before portrait generation begins. We accept major credit and debit cards through our secure payment processor (Stripe).
            </p>
            <p className="text-gray-700 leading-relaxed">
              Prices may change at any time, but changes will not affect orders already placed. All sales are final unless otherwise stated in our Refund Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We want you to be satisfied with your portraits. If you're not happy with your generated portraits, please contact us within 7 days of purchase. We may:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Regenerate your portraits at no additional cost</li>
              <li>Provide a full or partial refund, at our discretion</li>
              <li>Work with you to resolve any issues</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Refunds are not available for portraits that have been successfully generated and downloaded, unless there was a technical error on our part.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Service Availability</h2>
            <p className="text-gray-700 leading-relaxed">
              We strive to provide reliable service, but we do not guarantee uninterrupted or error-free operation. We may temporarily suspend services for maintenance, updates, or technical issues. We are not liable for any losses resulting from service interruptions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>NO WARRANTIES:</strong> Our services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Warranties that the service will be uninterrupted, secure, or error-free</li>
              <li>Warranties regarding the accuracy, reliability, or quality of AI-generated portraits</li>
              <li>Warranties that generated portraits will meet your specific expectations or requirements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>AI TECHNOLOGY DISCLAIMER:</strong> AI-generated content is created using artificial intelligence algorithms. Results may vary and are not guaranteed to be perfect, accurate, or suitable for any specific purpose. We do not warrant that AI-generated portraits will be error-free, accurate, or meet any particular artistic standard.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>THIRD-PARTY SERVICES:</strong> Our service relies on third-party AI providers, payment processors, and hosting services. We are not responsible for the availability, performance, or actions of these third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by applicable law, Fur and Fame, Timberline Collective LLC, its officers, directors, employees, agents, and affiliates shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
              <li>Loss of business opportunities or anticipated savings</li>
              <li>Portraits that don't meet your expectations, preferences, or requirements</li>
              <li>Technical failures, service interruptions, or errors in AI generation</li>
              <li>Loss or corruption of uploaded photos or generated portraits</li>
              <li>Unauthorized access to or use of your account or data</li>
              <li>Actions or omissions of third-party service providers</li>
              <li>Any damages resulting from your use or inability to use our services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>CAP ON LIABILITY:</strong> Our total cumulative liability to you for all claims arising from or related to our services, regardless of the form of action, shall not exceed the total amount you paid to us in the twelve (12) months preceding the claim, or $100, whichever is greater.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>EXCLUSIONS:</strong> Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability for incidental or consequential damages. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless Fur and Fame, Timberline Collective LLC, and its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, debt, and expenses (including but not limited to attorney's fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your use or misuse of our services</li>
              <li>Your violation of these Terms of Service</li>
              <li>Your violation of any third-party rights, including intellectual property rights</li>
              <li>Your violation of any applicable laws or regulations</li>
              <li>Content you upload, including photographs that infringe on third-party rights</li>
              <li>Your use of generated portraits in violation of these Terms or applicable law</li>
              <li>Any disputes between you and third parties related to our services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We reserve the right, at our own expense, to assume exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will cooperate with us in asserting any available defenses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Age Restrictions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our services are intended for users who are at least 18 years of age or the age of majority in their jurisdiction. By using our services, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You are at least 18 years old (or the age of majority in your jurisdiction)</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>If you are using our services on behalf of a minor, you are the parent or legal guardian with authority to consent to these Terms</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              If we become aware that a user under 18 (or the age of majority) has used our services without parental consent, we will terminate their account and delete their data in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Force Majeure</h2>
            <p className="text-gray-700 leading-relaxed">
              We shall not be liable for any failure or delay in performance under these Terms that is due to causes beyond our reasonable control, including but not limited to: acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, epidemics, network or internet failures, strikes, shortages of labor or materials, or failures of third-party service providers (including AI service providers, payment processors, or hosting services). In such events, we will use reasonable efforts to notify you and resume performance as soon as practicable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Dispute Resolution and Arbitration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Informal Resolution:</strong> Before filing a claim, you agree to contact us first to attempt to resolve the dispute informally. We will attempt to resolve disputes in good faith within 30 days of notification.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Binding Arbitration:</strong> If we cannot resolve a dispute informally, you agree that any dispute, claim, or controversy arising out of or relating to these Terms or our services shall be settled by binding arbitration administered by the American Arbitration Association ("AAA") in accordance with its Commercial Arbitration Rules, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Arbitration Details:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The arbitration will be conducted in Oregon, United States</li>
              <li>The arbitration will be conducted in English</li>
              <li>You waive your right to a jury trial and to participate in a class action lawsuit</li>
              <li>Arbitration will be conducted on an individual basis, not as a class action</li>
              <li>Each party will bear their own costs and attorney's fees unless otherwise required by law</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Exceptions:</strong> Either party may bring a lawsuit in court for claims of intellectual property infringement, injunctive relief, or other claims that cannot be arbitrated under applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your access to our services at any time, with or without cause or notice, for any reason including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Violation of these Terms of Service</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Extended periods of inactivity</li>
              <li>At our sole discretion for any reason</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Upon termination, your right to use our services will immediately cease. We may delete your account and data in accordance with our Privacy Policy. Provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time at our sole discretion. Material changes will be communicated through our website, via email, or through other reasonable means at least 30 days before they take effect.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of our services after changes become effective constitutes acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using our services and may terminate your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect and enforceable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">18. Entire Agreement</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and Fur and Fame regarding the use of our services and supersede all prior agreements, understandings, or communications, whether written or oral.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">19. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms are governed by and construed in accordance with the laws of the State of Oregon, United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Oregon, and you hereby consent to the personal jurisdiction and venue of such courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">20. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about these Terms, please contact us:
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
