// components/Footer.tsx
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  const socialIcons = [
    { icon: <FaFacebookF />, link: "https://www.facebook.com/profile.php?id=61579209638211" },
    { icon: <FaLinkedinIn />, link: "https://linkedin.com" },
    { icon: <FaYoutube />, link: "https://youtube.com" },
    { icon: <FaXTwitter />, link: "https://twitter.com" },
  ];

  const linkClass =
    "text-gray-600 hover:text-red-700 hover:underline transition duration-300";

  return (
    <footer className="bg-[#F9F9F9] py-12 px-6 mb-16 md:mb-0 -mt-40">
      <div className="flex flex-row justify-between items-center px-2 sm:px-8 md:px-20 text-gray-800">
        {/* Social Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Social</h3>
          <div className="flex mt-8 sm:mt-0 gap-4">
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


       
        <div> 
          <h3 className="text-xl font-semibold mb-4">Resources</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link to="shop/about" className={linkClass}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="shop/contact" className={linkClass}>
              Contact Us
            </Link>
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
