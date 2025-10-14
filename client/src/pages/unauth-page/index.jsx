import { useNavigate } from "react-router-dom";
import { Shield, Lock, Home, ArrowLeft, AlertTriangle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

function UnauthPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br  from-slate-50 via-white to-red-50/30 flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-red-400/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}

        {/* Large gradient blobs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-300/20 rounded-full blur-3xl animate-blob"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mt-12 mx-auto">
        {/* Animated Shield Icon */}
        <div className="relative mb-8">
          <div 
            className="inline-block relative"
            style={{
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl border-4 border-red-100">
              <Shield className="w-16 h-16 text-red-600" strokeWidth={1.5} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full mb-6 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-bold text-red-600">Access Denied</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 animate-fade-in-up">
          Unauthorized Access
        </h1>

        {/* Description */}
        <p className="text-md md:text-lg text-gray-600 mb-8 max-w-xl mx-auto animate-fade-in-up animation-delay-200">
          Oops! It looks like you don't have permission to view this page. This area is restricted to authorized users only.
        </p>

        {/* Info Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-red-100 mb-8 animate-fade-in-up animation-delay-400">
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <p className="text-left">If you believe this is a mistake, please contact support</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <p className="text-left">Make sure you're logged in with the correct account</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-yellow-600 font-bold">3</span>
              </div>
              <p className="text-left">Return to the homepage and try again</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gray-200 hover:border-red-300"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/shop/home")}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Return to Homepage
          </button>
        </div>

        

        {/* Additional Help Text */}
        <p className="mt-8 mb-10 text-sm text-gray-500 animate-fade-in-up animation-delay-1000">
          Need help? Contact us at{" "}
          <a href="mailto:headtouchbd@gmail.com" className="text-red-600 font-semibold hover:underline">
            headtouchbd@gmail.com
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-15px) translateX(5px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 10s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default UnauthPage;