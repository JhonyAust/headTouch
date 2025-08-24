import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProductThumbnails({
  images = [],
  onSelectImage,
  selectedImage,
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const thumbnailsPerView = 4;

  const maxSlide = Math.max(0, images.length - thumbnailsPerView);

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  return (
    <div className="w-full relative mt-4">
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-2"
          animate={{ x: `-${currentSlide * 88}px` }} // 80px width + 8px gap
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: `${images.length * 88}px` }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={`w-20 h-20 rounded overflow-hidden cursor-pointer border ${
                img === selectedImage ? "border-black" : "border-gray-300"
              }`}
              onClick={() => onSelectImage(img)}
            >
              <img
                src={img}
                alt={`thumb-${index}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Arrows */}
      {images.length > thumbnailsPerView && (
        <>
          <Button
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 shadow z-10 "
            onClick={handlePrev}
            disabled={currentSlide === 0}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 shadow z-10 "
            onClick={handleNext}
            disabled={currentSlide === maxSlide}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
}
