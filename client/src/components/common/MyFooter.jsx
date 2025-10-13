import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  const socialIcons = [
    { 
      icon: <FaFacebookF />, 
      link: "https://www.facebook.com/profile.php?id=61579209638211",
      name: "Facebook",
      color: "hover:bg-blue-600"
    },
    { 
      icon: <FaInstagram />, 
      link: "https://instagram.com",
      name: "Instagram",
      color: "hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600"
    },
    { 
      icon: <FaTiktok />, 
      link: "https://tiktok.com",
      name: "TikTok",
      color: "hover:bg-black"
    },
    { 
      icon: <FaXTwitter />, 
      link: "https://twitter.com",
      name: "X (Twitter)",
      color: "hover:bg-gray-800"
    },
  ];

  const linkClass =
    "text-gray-600 hover:text-purple-600 hover:translate-x-1 inline-block transition-all duration-300";

  return (
    <footer className="bg-white py-12 px-0 sm:px-6 mb-16 md:mb-0 -mt-40 relative overflow-hidden">
      {/* Decorative gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200 mt-4"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #9333ea 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2 sm:px-8 md:px-12 mb-8">
          
          {/* Social Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Connect With Us
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Follow us on social media for updates, offers, and more!
            </p>
            <div className="flex gap-3">
              {socialIcons.map((s, i) => (
                <a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${s.color}`}
                  aria-label={s.name}
                >
                  <span className="text-lg relative z-10">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Resources
              </h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <Link to="/shop/about" className={linkClass}>
                  About Us
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <Link to="/shop/contact" className={linkClass}>
                  Contact Us
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <Link to="/shop/terms" className={linkClass}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-600 to-red-600 rounded-full"></div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Get In Touch
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3 hover:text-purple-600 transition-colors duration-300">
                <Mail className="w-4 h-4 mt-0.5 text-purple-500" />
                <span>headtouchbd@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 hover:text-purple-600 transition-colors duration-300">
                <Phone className="w-4 h-4 mt-0.5 text-purple-500" />
                <span>+880 01521203595</span>
              </li>
              <li className="flex items-start gap-3 hover:text-purple-600 transition-colors duration-300">
                <MapPin className="w-4 h-4 mt-0.5 text-purple-500" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 sm:px-8 md:px-12">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © 2025 <span className="font-semibold text-gray-800">HeadTouch</span>. All rights reserved.
            </p>
          </div>

          {/* Developed by */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Developed with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://insynq.net"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              InSynq
              <ExternalLink className="w-3 h-3 text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl -z-10"></div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </footer>
  );
}