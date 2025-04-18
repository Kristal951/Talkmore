import { useState, useEffect } from "react";
import illustration2 from '../assets/illustrations/undraw_chatting_2b1g.svg'
import illustration3 from '../assets/illustrations/undraw_favorite-post_5ylx.svg'

const images = [
  illustration2,
  illustration3,
];

const Slide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 9000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {/* <button
        className="absolute left-4 p-2 bg-gray-800 text-white rounded-full"
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
      >
        ◀
      </button> */}

      <img src={images[currentIndex]} alt="Slide" className="w-[80%] h-[80%] object-contain transition-opacity duration-500" />

      {/* <button
        className="absolute right-4 p-2 bg-gray-800 text-white rounded-full"
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
      >
        ▶
      </button> */}
    </div>
  );
};

export default Slide;
