import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Phone, Package, CreditCard, Sparkles, ArrowRight, FileText, Building2, Hash } from "lucide-react";

function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const { address, cartItems, totalAmount } = location.state || {};

  useEffect(() => {
    if (!address || !cartItems || !totalAmount) {
      navigate("/shop/home", { replace: true });
    } else {
      setIsVisible(true);
    }
  }, [address, cartItems, totalAmount, navigate]);

  // Don't render if data is missing
  if (!address || !cartItems || !totalAmount) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 py-12 px-4 mt-12 sm:mt-0 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(40)].map((_, i) => {
          const isStar = i % 4 === 0;
          return (
            <div
              key={i}
              className={`absolute ${isStar ? 'animate-star-float' : 'animate-float-slow'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: isStar ? '12px' : `${Math.random() * 8 + 4}px`,
                height: isStar ? '12px' : `${Math.random() * 8 + 4}px`,
                background: i % 3 === 0 ? '#60a5fa' : i % 3 === 1 ? '#818cf8' : '#a78bfa',
                opacity: isStar ? 0.5 : 0.4,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 6}s`,
                clipPath: isStar ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'circle(50%)',
                borderRadius: isStar ? '0' : '50%'
              }}
            />
          );
        })}
      </div>

      {/* Success Icon with Ripple Effect */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className={`flex flex-col items-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            {/* Ripple Circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-green-400/20 animate-ping-slow"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center animation-delay-500">
              <div className="w-40 h-40 rounded-full bg-green-400/10 animate-ping-slow"></div>
            </div>
            
            {/* Success Icon */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-scale-in">
              <CheckCircle2 className="w-14 h-14 text-white animate-check-draw" strokeWidth={3} />
            </div>
          </div>

          <div className="mt-8 text-center animate-fade-in animation-delay-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Order Confirmed
              </span>
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Thank You!
            </h1>
            <p className="text-gray-600 text-lg">
              Your order has been received and is being processed
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full border border-blue-200">
              <Package className="w-5 h-5 text-blue-600 animate-bounce-subtle" />
              <span className="text-blue-700 font-medium">Order ID: #ORD-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Details Card */}
          <div className={`bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden transform transition-all duration-700 hover:shadow-xl ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
               style={{ transitionDelay: '400ms' }}>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center animate-pulse-subtle">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-50 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                  <p className="text-gray-900 font-medium">{address.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-50 transition-colors">
                  <Building2 className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">City</p>
                  <p className="text-gray-900 font-medium">{address.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-50 transition-colors">
                  <Hash className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Pincode</p>
                  <p className="text-gray-900 font-medium">{address.pincode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-50 transition-colors">
                  <Phone className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                  <p className="text-gray-900 font-medium">{address.phone}</p>
                </div>
              </div>

              {address.notes && (
                <div className="flex items-start gap-3 group">
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-50 transition-colors">
                    <FileText className="w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                    <p className="text-gray-900 font-medium">{address.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Details Card */}
          <div className={`bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden transform transition-all duration-700 hover:shadow-xl ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
               style={{ transitionDelay: '500ms' }}>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center animate-pulse-subtle">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your order will be delivered within 2-4 business days. Our delivery partner will contact you before delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Summary Card */}
        {cartItems && cartItems.length > 0 && (
          <div className={`mt-6 bg-white rounded-2xl shadow-lg border border-blue-100/50 overflow-hidden transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
               style={{ transitionDelay: '600ms' }}>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center animate-pulse-subtle">
                  <Package className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                {cartItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors animate-fade-in"
                    style={{ animationDelay: `${700 + index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right ml-4">
                      {item.salePrice > 0 && (
                        <p className="text-xs text-gray-400 line-through">৳{item.price}</p>
                      )}
                      <p className="font-semibold text-indigo-600">
                        ৳{item.salePrice > 0 ? item.salePrice : item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-bold text-indigo-600">৳{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/shop/account")}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>View Order History</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(-10px);
          }
          75% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          80%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes scale-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes check-draw {
          0% {
            stroke-dasharray: 0, 100;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 100, 0;
            stroke-dashoffset: 0;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes star-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0.5;
          }
          25% {
            transform: translateY(-20px) translateX(10px) rotate(90deg) scale(1.1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40px) translateX(-10px) rotate(180deg) scale(1.2);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(10px) rotate(270deg) scale(1.1);
            opacity: 0.4;
          }
        }

        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .animate-check-draw {
          animation: check-draw 0.8s ease-out 0.3s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-star-float {
          animation: star-float ease-in-out infinite;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default OrderConfirmation;