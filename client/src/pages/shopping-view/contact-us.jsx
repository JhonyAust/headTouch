import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Sparkles, Facebook, Instagram } from "lucide-react";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Us",
      detail: "headtouchbd@gmail.com",
      link: "mailto:headtouchbd@gmail.com",
      description: "Send us an email anytime",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us",
      detail: "01521203595",
      link: "tel:01521203595",
      description: "Mon-Sat, 10AM - 8PM",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location",
      detail: "Dhaka, Bangladesh",
      link: null,
      description: "We deliver nationwide",
      gradient: "from-green-600 to-emerald-600"
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-6 h-6" />,
      name: "Facebook",
      link: "https://www.facebook.com/people/HEAD-TOUCH-BD/61579209638211/",
      color: "hover:bg-blue-600",
      gradient: "from-blue-600 to-blue-700"
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      name: "Instagram",
      link: "https://instagram.com",
      color: "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600",
      gradient: "from-purple-600 to-pink-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-purple-700 to-pink-700 text-white py-24 md:py-32 px-6 overflow-hidden mt-16 md:mt-0">
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
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <MessageCircle className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-semibold">We're Here to Help</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto"
          >
            Have questions about our premium caps? We'd love to hear from you! Reach out anytime.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20  relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${method.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {method.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {method.title}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4">
                {method.description}
              </p>

              {method.link ? (
                <a
                  href={method.link}
                  className={`text-lg font-semibold bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent hover:underline`}
                >
                  {method.detail}
                </a>
              ) : (
                <p className={`text-lg font-semibold bg-gradient-to-r ${method.gradient} bg-clip-text text-transparent`}>
                  {method.detail}
                </p>
              )}

              {/* Decorative gradient line */}
             
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Contact Card */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-purple-100"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Send Us a Message</h2>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="space-y-8">
              {/* Email Contact */}
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Email Address</h3>
                  <a
                    href="mailto:headtouchbd@gmail.com"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-lg hover:underline"
                  >
                    headtouchbd@gmail.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">
                    We typically respond within 24 hours
                  </p>
                </div>
              </div>

              {/* Phone Contact */}
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Phone Number</h3>
                  <a
                    href="tel:01521203595"
                    className="text-blue-600 hover:text-blue-700 font-semibold text-lg hover:underline"
                  >
                    01521203595
                  </a>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      Monday - Saturday: 10:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Follow Us on Social Media
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group w-14 h-14 bg-gradient-to-r ${social.gradient} rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 hover:scale-110`}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Stay updated with our latest collections, offers, and style tips!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 py-20 px-6 relative overflow-hidden">
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

        <div className="max-w-4xl mx-auto text-center relative z-10 ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <MessageCircle className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white">Always Available</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Let's Connect & Collaborate
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Have a question, want to collaborate, or just want to say hi? Drop us an email or give us a call. 
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