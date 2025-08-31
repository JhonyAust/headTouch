// components/Footer.tsx
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  const socialIcons = [
    { icon: <FaFacebookF />, link: "https://facebook.com" },
    { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
    { icon: <FaYoutube />, link: "https://youtube.com" },
    { icon: <FaXTwitter />, link: "https://twitter.com" },
  ];

  const linkClass =
    "text-gray-600 hover:text-red-700 hover:underline transition duration-300";

  return (
    <footer className="bg-[#F9F9F9] py-12 px-6 mb-16 md:mb-0 -mt-40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-gray-800">
        {/* Social Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Social</h3>
          <div className="flex gap-4">
            {socialIcons.map((s, i) => (
              <a
                key={i}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-slate-700 hover:scale-110 transition-transform duration-300 text-xl"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Product Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className={linkClass}>Grid & Layouts</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Typography</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Media Manager</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Form Builder</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Pop-up Builder</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Interaction & Animations</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Accessibility</a>
            </li>
          </ul>
        </div>

        {/* Company Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className={linkClass}>Affiliates</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Terms & Privacy</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Cookie</a>
            </li>
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className={linkClass}>Blog</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Documentation</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Release Notes</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Support</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Pricing</a>
            </li>
            <li>
              <a href="#" className={linkClass}>Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 mt-12 pt-6 text-center text-sm text-gray-500">
        © 2025 HeadTouch. All rights reserved.
      </div>
    </footer>
  );
}
