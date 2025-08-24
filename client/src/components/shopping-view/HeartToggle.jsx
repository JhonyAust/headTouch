// components/shopping-view/HeartToggle.jsx
import { Heart } from "lucide-react";

function HeartFilled(props) {
  return <Heart fill="currentColor" {...props} />;
}

function HeartToggle({ isActive, onClick }) {
  return (
    <div className="absolute top-2 right-2 z-10">
      <button
        onClick={onClick}
        className={`p-1  transition-colors duration-200 ${
          isActive ? "text-red-500" : "text-gray-100"
        }`}
      >
        {isActive ? <HeartFilled className="w-5 h-5" /> : <Heart className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default HeartToggle;
