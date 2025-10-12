import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, Award, Heart, Globe, ShoppingBag, Target, Users, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Craftsmanship",
      description: "Durable, stylish, and built for ultimate comfort with attention to every detail.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trend-Driven Designs",
      description: "From classic essentials to eye-catching statements that turn heads.",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Bangladeshi Pride",
      description: "Homegrown creativity, crafted with love, made for the world.",
      gradient: "from-green-600 to-emerald-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer-Centered",
      description: "Your style, your satisfaction, our ultimate priority always.",
      gradient: "from-orange-600 to-red-600"
    },
  ];

  const values = [
    { icon: <CheckCircle className="w-5 h-5" />, text: "Premium Quality Materials" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Unique Modern Designs" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Fast Delivery Across Bangladesh" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "100% Customer Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-pink-700 text-white py-24 md:py-32 px-6 overflow-hidden mt-16 md:mt-0">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-semibold">Premium Cap Brand</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Make Every Look <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Legendary
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl mb-4 text-white/90"
          >
            Caps that speak louder than words
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 text-sm md:text-base mb-8"
          >
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              🎯 Premium Quality
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              🔥 Unique Designs
            </span>
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              🇧🇩 Made in Bangladesh
            </span>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={() => navigate("/shop/listing")}
            className="group inline-flex items-center gap-2 bg-white text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Shop Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-50 rounded-full">
            <Target className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">Our Story</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
            About HeadTouch
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-purple-100">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            Welcome to <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">HeadTouch</span> — a proud Bangladeshi-owned cap brand redefining the way you wear style. We believe a cap is more than just an accessory — it's a <span className="font-semibold text-purple-600">statement</span>, an <span className="font-semibold text-pink-600">attitude</span>, and a way to make every look legendary. 
          </p>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
              >
                <div className="text-purple-600">{value.icon}</div>
                <span className="text-gray-700 font-medium">{value.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Award className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">Our Commitment</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Our Promise to You
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            At HeadTouch, we create caps that speak louder than words. Every design is crafted with a blend of <span className="font-semibold">premium quality</span>, <span className="font-semibold">modern trends</span>, and <span className="font-semibold">bold individuality</span> — so you don't just wear a cap, you wear your personality.
          </p>
        </div>
      </section>

      {/* Why HeadTouch - Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-full">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-cyan-600 bg-clip-text text-transparent">
            Why HeadTouch?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're not just selling caps — we're delivering confidence, style, and quality in every piece.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              
              {/* Decorative gradient line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-20 px-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Globe className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold">Future Goals</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Vision</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-white/90">
            HeadTouch isn't just a brand — it's a <span className="font-semibold text-yellow-300">movement of cap lovers</span>. Our vision is to put Bangladesh on the global fashion map with a brand that inspires confidence, creativity, and individuality in everyone who wears it.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Ready to Level Up Your Style?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Let HeadTouch be the crown to your style. Shop our exclusive collection today.
            </p>
            <button
              onClick={() => navigate("/shop/listing")}
              className="group inline-flex items-center gap-2 bg-white text-purple-700 px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Explore Collection
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;