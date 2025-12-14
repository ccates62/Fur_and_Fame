"use client";

import Link from "next/link";

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How does AI pet portrait generation work?",
          a: "Simply upload a clear photo of your pet, choose your preferred style (Renaissance, Disney, Superhero, etc.), and our AI will create a stunning portrait in that style. The process takes just a few minutes, and you'll receive multiple variations to choose from.",
        },
        {
          q: "What photo quality do I need?",
          a: "For best results, use a clear, well-lit photo where your pet's face is clearly visible. Photos should be at least 800x800 pixels. Avoid blurry images, extreme angles, or photos where the pet is too far away. The AI works best with photos focused on the face.",
        },
        {
          q: "Can I include multiple pets or people in one portrait?",
          a: "Yes! You can create portraits with multiple pets, or combine pets with people. During the creation process, you'll be able to specify how many subjects you want to include and provide details for each.",
        },
      ],
    },
    {
      category: "Portrait Styles & Options",
      questions: [
        {
          q: "What portrait styles are available?",
          a: "We offer two main types: Basic portraits (with customizable layouts and backgrounds) and Styled portraits (with themed backgrounds like Renaissance, Disney, Marvel, and more). You can preview different style options during the creation process.",
        },
        {
          q: "Can I change the background after generation?",
          a: "Yes! After your portraits are generated, you can choose to make the background translucent/transparent or select a different background color without regenerating the entire image.",
        },
        {
          q: "How many portrait variations will I receive?",
          a: "You'll receive multiple variations of your portrait to choose from. The exact number depends on your selected package, but you'll always have options to pick your favorite.",
        },
      ],
    },
    {
      category: "Pricing & Payment",
      questions: [
        {
          q: "How much does a pet portrait cost?",
          a: "Pricing varies based on the number of subjects and the style you choose. Basic portraits start at a lower price point, while styled portraits with themes are priced higher. You'll see exact pricing during the creation process before you commit to purchase.",
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards and debit cards through our secure Stripe payment processor. All payments are processed securely and encrypted.",
        },
        {
          q: "Do you offer refunds?",
          a: "We want you to be happy with your portrait! If you're not satisfied with your generated portraits, please contact us within 7 days of purchase. We'll work with you to either regenerate your portraits or provide a refund. See our Refund Policy for full details.",
        },
      ],
    },
    {
      category: "Delivery & Downloads",
      questions: [
        {
          q: "How do I receive my portraits?",
          a: "Once your portraits are generated, you'll be able to download them immediately from your account. You'll receive high-resolution digital files that you can use for printing, sharing, or digital display.",
        },
        {
          q: "What file format will I receive?",
          a: "You'll receive high-resolution images in standard formats (typically PNG or JPG) that are suitable for printing or digital use.",
        },
        {
          q: "Can I print my portraits?",
          a: "Absolutely! Your portraits are provided in high resolution suitable for printing. You can print them at home, use a local print shop, or order prints through our recommended print-on-demand partners (coming soon).",
        },
      ],
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "The generation failed or I got an error. What should I do?",
          a: "If you encounter any errors during generation, please contact our support team immediately. We'll investigate the issue and either regenerate your portraits at no cost or provide a full refund.",
        },
        {
          q: "How long does portrait generation take?",
          a: "Most portraits are generated within 2-5 minutes. Complex multi-subject portraits may take slightly longer. You'll see a progress indicator during the generation process.",
        },
        {
          q: "Can I edit my portraits after generation?",
          a: "While you can't edit the AI-generated portraits directly through our platform, you can download them and use image editing software if needed. We also offer background modification options (translucent/transparent backgrounds) without regenerating.",
        },
      ],
    },
    {
      category: "Account & Privacy",
      questions: [
        {
          q: "Do I need to create an account?",
          a: "You can start creating portraits without an account, but we recommend creating one to save your portraits, track your orders, and access your download history.",
        },
        {
          q: "What happens to my pet photos?",
          a: "Your photos are used solely for generating your portraits and are stored securely. We never share your photos with third parties. See our Privacy Policy for complete details on how we handle your data.",
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can request account deletion at any time by contacting our support team. We'll remove your account and associated data in accordance with our Privacy Policy.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about creating AI pet portraits
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-amber-600 mb-6">
                {section.category}
              </h2>
              <div className="space-y-6">
                {section.questions.map((faq, faqIdx) => (
                  <div key={faqIdx} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-amber-50 border-2 border-amber-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? We're here to help!
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition shadow-lg"
          >
            Contact Support
          </Link>
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
