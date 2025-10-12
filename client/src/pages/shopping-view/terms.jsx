import { Shield, CheckCircle, AlertCircle, Scale, FileText, Lock, Package, CreditCard, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "1. Acceptance of Terms",
      gradient: "from-blue-600 to-cyan-600",
      content: (
        <>
          <p className="mb-4">
            Welcome to <span className="font-semibold text-purple-600">HeadTouch</span>. By accessing and using our website or purchasing our premium caps, you agree to be bound by these Terms and Conditions, all applicable laws, and regulations of Bangladesh.
          </p>
          <p>
            If you do not agree with any part of these terms, please do not use our services or purchase our products.
          </p>
        </>
      ),
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "2. Products & Services",
      gradient: "from-purple-600 to-pink-600",
      content: (
        <>
          <p className="mb-4">
            HeadTouch specializes in selling modern, premium, and attractive caps designed for style-conscious individuals in Bangladesh. All product descriptions, images, and specifications are provided for informational purposes.
          </p>
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>We strive to ensure all product information is accurate, but we do not warrant that descriptions or other content is error-free.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>Product availability is subject to stock levels and may change without prior notice.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>Colors may vary slightly from images due to screen display settings.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "3. Orders & Payment",
      gradient: "from-orange-600 to-red-600",
      content: (
        <>
          <p className="mb-4 font-semibold text-gray-800">Order Placement:</p>
          <p className="mb-4">
            When you place an order on HeadTouch, you are making an offer to purchase our products. We reserve the right to accept or decline your order for any reason, including product availability, pricing errors, or fraudulent activity.
          </p>
          
          <p className="mb-4 font-semibold text-gray-800">Payment Methods:</p>
          <ul className="space-y-2 ml-6 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>We accept Cash on Delivery (COD), bKash, Nagad, Rocket, and credit/debit cards.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>All prices are listed in Bangladeshi Taka (৳).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>Payment must be completed before order processing for online payment methods.</span>
            </li>
          </ul>

          <p className="mb-4 font-semibold text-gray-800">Pricing:</p>
          <p>
            Prices are subject to change without prior notice. The price applicable to your order is the price displayed at the time of purchase.
          </p>
        </>
      ),
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "4. Shipping & Delivery",
      gradient: "from-green-600 to-emerald-600",
      content: (
        <>
          <p className="mb-4">
            We deliver our premium caps across Bangladesh. Delivery times and charges vary based on your location.
          </p>
          
          <ul className="space-y-2 ml-6 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span><strong>Dhaka:</strong> 1-3 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span><strong>Outside Dhaka:</strong> 3-7 business days</span>
            </li>
          </ul>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">Important:</p>
                <p className="text-sm text-amber-700">
                  HeadTouch is not responsible for delays caused by incorrect shipping information, natural disasters, political unrest, or courier service disruptions.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "5. Returns & Refunds",
      gradient: "from-indigo-600 to-purple-600",
      content: (
        <>
          <p className="mb-4 font-semibold text-gray-800">Return Policy:</p>
          <p className="mb-4">
            We want you to be completely satisfied with your purchase. If you're not happy with your cap, you may return it within <strong>7 days</strong> of delivery.
          </p>

          <p className="mb-4 font-semibold text-gray-800">Return Conditions:</p>
          <ul className="space-y-2 ml-6 mb-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>The cap must be unused, unwashed, and in original condition with all tags attached.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>Original packaging must be intact.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>Return shipping costs are the customer's responsibility unless the item is defective or wrong.</span>
            </li>
          </ul>

          <p className="mb-4 font-semibold text-gray-800">Refund Process:</p>
          <p className="mb-4">
            Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, refunds will be processed within 7-14 business days to your original payment method.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 mb-1">Non-Returnable Items:</p>
                <p className="text-sm text-red-700">
                  Sale items, promotional products, and customized caps cannot be returned or exchanged.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "6. Privacy & Data Protection",
      gradient: "from-pink-600 to-rose-600",
      content: (
        <>
          <p className="mb-4">
            Your privacy is important to us. We collect and use your personal information in accordance with Bangladesh's data protection laws.
          </p>
          
          <ul className="space-y-2 ml-6">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>We collect name, phone number, email, and shipping address for order processing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>Your information will never be sold or shared with third parties without consent.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-1 shrink-0" />
              <span>We use secure payment gateways to protect your financial information.</span>
            </li>
          </ul>
        </>
      ),
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "7. Governing Law",
      gradient: "from-gray-700 to-gray-900",
      content: (
        <>
          <p className="mb-4">
            These Terms and Conditions are governed by and construed in accordance with the laws of the <strong>People's Republic of Bangladesh</strong>.
          </p>
          <p>
            Any disputes arising from these terms or your use of HeadTouch shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
          </p>
        </>
      ),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "8. Limitation of Liability",
      gradient: "from-cyan-600 to-blue-600",
      content: (
        <>
          <p className="mb-4">
            HeadTouch shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or products.
          </p>
          <p>
            Our total liability for any claim arising from your purchase shall not exceed the amount paid for the product in question.
          </p>
        </>
      ),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "9. Changes to Terms",
      gradient: "from-violet-600 to-purple-600",
      content: (
        <>
          <p className="mb-4">
            HeadTouch reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website.
          </p>
          <p>
            Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full shadow-lg border border-purple-100">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Legal Document</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-900 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
            
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              Please read these terms carefully before using HeadTouch's services or purchasing our premium caps.
            </p>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Last Updated: January 2025
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Scale className="w-4 h-4" />
                Bangladesh Law
              </span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 overflow-hidden"
            >
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.gradient} p-6 flex items-center gap-4`}>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {section.title}
                </h2>
              </div>

              {/* Section Content */}
              <div className="p-8 text-gray-700 leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Have Questions?
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            If you have any questions about these Terms and Conditions, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Contact Us
              <FileText className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            By using HeadTouch, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}