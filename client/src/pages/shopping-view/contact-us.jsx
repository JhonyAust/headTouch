import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles, Facebook, Instagram, ArrowRight } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Email Us",
      detail: "headtouchbd@gmail.com",
      link: "mailto:headtouchbd@gmail.com",
      description: "Send us an email anytime",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500"
    },
    {
      icon: <Phone className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Call Us",
      detail: "01521203595",
      link: "tel:01521203595",
      description: "Mon-Sat, 10AM - 8PM",
      gradient: "from-blue-500 via-cyan-500 to-teal-500"
    },
    {
      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Location",
      detail: "Dhaka, Bangladesh",
      link: null,
      description: "We deliver nationwide",
      gradient: "from-emerald-500 via-green-500 to-lime-500"
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />,
      name: "Facebook",
      link: "https://www.facebook.com/people/HEAD-TOUCH-BD/61579209638211/",
      gradient: "from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800"
    },
    {
      icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />,
      name: "Instagram",
      link: "https://instagram.com/headtouchbd",
      gradient: "from-purple-600 via-pink-600 to-orange-500",
      hoverColor: "hover:from-purple-700 hover:via-pink-700 hover:to-orange-600"
    },
    {
      icon: <FaTiktok className="w-5 h-5 sm:w-6 sm:h-6" />,
      name: "TikTok",
      link: "https://www.tiktok.com/@headtouchbd",
      gradient: "from-gray-900 to-black",
      hoverColor: "hover:from-black hover:to-gray-900"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 relative overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; box-shadow: 0 0 20px rgba(168, 85, 247, 0.4); }
          50% { opacity: 1; box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }

        .animate-gradient {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }

        .gradient-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .shadow-soft {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .shadow-medium {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .shadow-strong {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .shadow-glow {
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-pink-700 text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden mt-16 md:mt-0">
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-purple-900/30" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 sm:px-6 py-2 sm:py-3 gradient-glass rounded-full border border-white/30 shadow-glow"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">24/7 CUSTOMER SUPPORT</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight mb-6 sm:mb-8"
          >
            Let's Connect
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="space-y-4"
          >
            <p className="text-lg sm:text-xl md:text-3xl font-semibold text-white/95 max-w-4xl mx-auto px-4 leading-relaxed">
              Your satisfaction is our priority
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto px-4">
              Got questions about our premium caps? We're here to help! Reach out anytime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 sm:mt-12 flex flex-wrap gap-4 justify-center"
          >
            <a
              href="mailto:headtouchbd@gmail.com"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-full font-bold text-sm sm:text-base shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              Email Us Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="tel:01521203595"
              className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 gradient-glass border border-white/30 text-white rounded-full font-bold text-sm sm:text-base shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              Call Us
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-4">
            Multiple Ways to Reach Us
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred method of communication
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative bg-white rounded-3xl p-8 sm:p-10 shadow-soft hover:shadow-strong transition-all duration-500 border border-border overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon Container */}
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-medium group-hover:shadow-glow group-hover:scale-110 transition-all duration-500`}>
                {method.icon}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {method.title}
              </h3>
              
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {method.description}
              </p>

              {method.link ? (
                <a
                  href={method.link}
                  className="inline-block text-base sm:text-lg font-bold  text-purple-500 transition-colors duration-300 break-all group-hover:underline decoration-2 underline-offset-4"
                >
                  <span class="bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
  {method.detail}
</span>

                  
                </a>
              ) : (
                <p className="text-base sm:text-lg font-bold text-emerald-500">
                  {method.detail}
                </p>
              )}

              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${method.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Contact Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-white shadow-strong rounded-3xl sm:rounded-[2.5rem] overflow-hidden border border-border"
        >
          {/* Header Section */}
          <div className="relative gradient-primary px-6 sm:px-12 py-8 sm:py-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-float" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-float-slow" />
            
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 gradient-glass rounded-2xl flex items-center justify-center shadow-medium">
                <Send className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
                  Send Us a Message
                </h2>
                <p className="text-sm sm:text-base text-white/90">
                  We're always happy to hear from you
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-12 md:p-16">
            <div className="space-y-6 sm:space-y-8">
              {/* Email Contact */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-soft group-hover:shadow-medium group-hover:scale-110 transition-all duration-300">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-black text-lg sm:text-xl text-foreground mb-2">
                    Email Address
                  </h3>
                  <a
                    href="mailto:headtouchbd@gmail.com"
                    className="inline-block text-primary  font-bold text-purple-500 text-base sm:text-lg md:text-xl hover:underline decoration-2 underline-offset-4 break-all transition-colors duration-300"
                  >
                    headtouchbd@gmail.com
                  </a>
                  <p className="text-sm sm:text-base text-muted-foreground mt-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    We typically respond within 24 hours
                  </p>
                </div>
              </motion.div>

              {/* Phone Contact */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-medium transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0 shadow-soft group-hover:shadow-medium group-hover:scale-110 transition-all duration-300">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-black text-lg sm:text-xl text-foreground mb-2">
                    Phone Number
                  </h3>
                  <a
                    href="tel:01521203595"
                    className="inline-block text-blue-500 font-bold text-base sm:text-lg md:text-xl hover:underline decoration-2 underline-offset-4 transition-colors duration-300"
                  >
                    01521203595
                  </a>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Monday - Saturday: 10:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Social Media */}
              <div className="pt-6 sm:pt-8 border-t-2 border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-soft">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="font-black text-xl sm:text-2xl text-foreground">
                    Follow Us on Social Media
                  </h3>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${social.gradient} ${social.hoverColor} rounded-2xl flex items-center justify-center text-white shadow-medium hover:shadow-strong transition-all duration-300`}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
                
                <p className="text-sm sm:text-base text-muted-foreground">
                  Stay updated with our latest collections, exclusive offers, and style inspirations!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 sm:px-6 py-2 sm:py-3 gradient-glass rounded-full border border-white/30">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">ALWAYS AVAILABLE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight">
              Let's Build Something
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Amazing Together
              </span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Whether you have a question, feedback, or just want to say hi — we're all ears! 
              <span className="font-bold text-yellow-300"> HeadTouch BD</span> is committed to providing 
              exceptional service and premium quality caps. 🧢✨
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="https://wa.me/8801521203595?text=Hi%20HeadTouch%20BD!%20I%20have%20a%20question%20about%20your%20caps."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-base shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                Start a Conversation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
