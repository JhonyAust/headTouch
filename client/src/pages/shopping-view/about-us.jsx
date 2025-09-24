// src/pages/AboutUs.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mt-8 sm:mt-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            🧢 Make Every Look Legendary
          </motion.h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            🔥 Caps that speak louder than words
          </p>
          <p className="text-sm md:text-base opacity-80">
            🎯 Premium Quality | Unique Designs
          </p>
          <p className="mt-4 text-sm">📬 DM for orders</p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-6">🧢 About Headtouch</h2>
        <p className="text-center text-lg max-w-3xl mx-auto leading-relaxed">
          Welcome to <span className="font-semibold">Headtouch</span> — a proud
          Bangladeshi-owned cap brand redefining the way you wear style. 
          We believe a cap is more than just an accessory — it’s a statement, 
          an attitude, and a way to make every look legendary.
        </p>
      </section>

      {/* Our Promise */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">🔥 Our Promise</h2>
          <p className="text-center max-w-3xl mx-auto leading-relaxed">
            At Headtouch, we create caps that speak louder than words. 
            Every design is crafted with a blend of premium quality, modern trends, 
            and bold individuality — so you don’t just wear a cap, you wear your personality.
          </p>
        </div>
      </section>

      {/* Why Headtouch */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">🎯 Why Headtouch?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h3 className="font-semibold mb-2">Premium Fabrics & Craftsmanship</h3>
            <p className="text-sm text-gray-600">
              Durable, stylish, and built for comfort.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h3 className="font-semibold mb-2">Unique, Trend-Driven Designs</h3>
            <p className="text-sm text-gray-600">
              From classic essentials to eye-catching statements.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h3 className="font-semibold mb-2">Bangladeshi Pride</h3>
            <p className="text-sm text-gray-600">
              Homegrown creativity, made for the world.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h3 className="font-semibold mb-2">Customer-Centered Experience</h3>
            <p className="text-sm text-gray-600">
              Your style, your satisfaction, our priority.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">🌍 Our Vision</h2>
          <p className="max-w-3xl mx-auto leading-relaxed opacity-90">
            Headtouch isn’t just a brand — it’s a movement of cap lovers. 
            Our vision is to put Bangladesh on the global fashion map with a brand 
            that inspires confidence, creativity, and individuality in everyone who wears it.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">📬 Order Today</h2>
        <p className="text-gray-700 mb-6">
          Let Headtouch be the crown to your style.
        </p>
        <button onClick={() => navigate("/shop/listing")} className="bg-ds_orange text-white px-6 py-3 rounded-full font-semibold hover:bg-ds_orange_hover transition">
          Shop Now
        </button>
      </section>
    </div>
  );
};

export default AboutUs;
