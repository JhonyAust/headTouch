// components/common/LoadingScreen.jsx
import React from "react";
import { motion } from "framer-motion";
import img from "../../assets/logo.png";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <motion.img
        src={img}
        alt="Logo"
        className="w-32 h-32 object-contain"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
