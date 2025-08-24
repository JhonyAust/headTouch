import { useState, useRef } from "react";

export default function ProductMagnifier({ src, zoom = 2 }) {
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const ref = useRef(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setBackgroundPosition("center");
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={isHovering ? handleMouseMove : null}
      onMouseLeave={handleMouseLeave}
      className="w-full h-[300px] px-4 bg-center bg-cover cursor-zoom-in"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: isHovering ? `${zoom * 100}%` : "cover",
        backgroundPosition,
      }}
    ></div>
  );
}
