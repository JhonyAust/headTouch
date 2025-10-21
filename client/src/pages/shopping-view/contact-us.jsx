import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles, Facebook, Instagram } from "lucide-react";
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
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <Phone className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Call Us",
      detail: "01521203595",
      link: "tel:01521203595",
      description: "Mon-Sat, 10AM - 8PM",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Location",
      detail: "Dhaka, Bangladesh",
      link: null,
      description: "We deliver nationwide",
      gradient: "from-green-600 to-emerald-600"
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />,
      name: "Facebook",
      link: "https://www.facebook.com/people/HEAD-TOUCH-BD/61579209638211/",
      color: "hover:bg-blue-600",
      gradient: "from-blue-600 to-blue-700"
    },
    {
      icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />,
      name: "Instagram",
      link: "https://instagram.com/headtouchbd",
      color: "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <FaTiktok className="w-5 h-5 sm:w-6 sm:h-6" />,
      name: "TikTok",
      link: "https://www.tiktok.com/@headtouchbd",
      color: "hover:bg-gradient-to-r hover:from-gray-800 hover:to-black",
      gradient: "from-gray-800 to-black"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-pink-700 text-white py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden mt-16 md:mt-0">
        {/* Animated Background */}
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

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
            <span className="text-xs sm:text-sm font-semibold">We're Here to Help</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white/90 max-w-3xl mx-auto px-4"
          >
            Have questions about our premium caps? We'd love to hear from you! Reach out anytime.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {method.icon}
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {method.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                {method.description}
              </p>

              {method.link ? (
                <a
                  href={method.link}
                  className={`text-base sm:text-lg font-semibold bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent hover:underline break-all`}
                >
                  {method.detail}
                </a>
              ) : (
                <p className={`text-base sm:text-lg font-semibold bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent`}>
                  {method.detail}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Contact Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-purple-100"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Send Us a Message</h2>
            </div>
          </div>

          <div className="p-4 sm:p-8 md:p-12">
            <div className="space-y-4 sm:space-y-8">
              {/* Email Contact */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl hover:shadow-md transition-shadow duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">Email Address</h3>
                  <a
                    href="mailto:headtouchbd@gmail.com"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm sm:text-base md:text-lg hover:underline break-all block"
                  >
                    headtouchbd@gmail.com
                  </a>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Phone Contact */}
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl hover:shadow-md transition-shadow duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2">Phone Number</h3>
                  <a
                    href="tel:01521203595"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base md:text-lg hover:underline block"
                  >
                    01521203595
                  </a>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600">
                      Monday - Saturday: 10:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-4 sm:pt-6 border-t border-gray-200">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Follow Us on Social Media
                </h3>
                <div className="flex gap-3 sm:gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${social.gradient} rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-110`}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                  Stay updated with our latest collections, offers, and style tips!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Animated particles */}
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

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Always Available</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 text-white px-4">
              Let's Connect & Collaborate
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-white/90 max-w-3xl mx-auto px-4">
              Have a question or just want to say hi? Drop us an email or give us a call. 
              <span className="font-semibold text-yellow-300"> HeadTouch is always here for you</span>. 🧢🔥
            </p>
          </motion.div>
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

export default ContactUs;