// src/pages/ContactUs.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaFacebook, FaInstagram } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mt-8 sm:mt-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            📞 Contact Headtouch
          </motion.h1>
          <p className="mt-4 ml-12 text-lg md:text-xl opacity-90">
            We’d love to hear from you! Reach us anytime.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-10 text-center"
        >
          <h2 className="text-2xl font-bold mb-8">📬 Get in Touch</h2>
          <div className="space-y-6 text-lg">
            <p className="flex items-center justify-center gap-3">
              <FaEnvelope className="text-black" />{" "}
              <a
                href="mailto:headtouchbd@gmail.com"
                className="text-gray-700 hover:text-black transition"
              >
                headtouchbd@gmail.com
              </a>
            </p>
            <p className="flex items-center justify-center gap-3">
              <FaPhoneAlt className="text-black" />{" "}
              <a
                href="tel:01521203595"
                className="text-gray-700 hover:text-black transition"
              >
                01521203595
              </a>
            </p>
            <div className="flex justify-center gap-8 pt-6">
              <a
                href="https://www.facebook.com/people/HEAD-TOUCH-BD/61579209638211/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black text-2xl"
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black text-2xl"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Vision/CTA */}
      <section className="bg-gray-100 py-16 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-4"
        >
          Let’s Connect
        </motion.h2>
        <p className="text-gray-700">
          Have a question or want to collaborate? Just drop us an email or call us directly.  
          Headtouch is always here for you. 🧢🔥
        </p>
      </section>
    </div>
  );
};

export default ContactUs;
