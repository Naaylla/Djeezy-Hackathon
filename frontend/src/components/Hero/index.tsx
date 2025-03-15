"use client";

import { AnimatedStat } from "../stats/animated-stats";
import { useIntersectionObserver } from "../../lib/use-intersection-observer";
import { useEffect, useState } from "react";
import ImageCarousel from "../image carousel/ImageCarousel";

// Import your hero images
import hero_pic from "../../assets/hero/hero-pic.png";
import hero_button from "../../assets/hero/hero-button.svg";
import hero_skew from "../../assets/hero/hero-skew.svg";

// Add more hero images here - use absolute URLs for testing
const heroImages = [
  hero_pic,
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000", // Example image
];

export default function Hero() {
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
  });
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  useEffect(() => {
    if (isInView) {
      setIsHeaderVisible(true);
    }
  }, [isInView]);

  return (
    <div className="bg-beige w-full">
      <div className="relative w-full h-[500px] flex items-center bg-beige overflow-hidden">
        <img
          src={hero_skew || "/placeholder.svg"}
          alt="Skew background"
          className="absolute left-0 top-0 h-full w-auto z-10"
        />

        <div className="absolute right-0 top-0 w-full h-full z-0">
          <ImageCarousel
            images={heroImages}
            interval={6000}
            className="absolute right-0 top-0 w-auto h-full object-cover z-0"
          />
        </div>

        <div className="relative z-20 ml-20">
          <p className="text-6xl font-bold text-black">9OUFA</p>
          <p className="text-lg text-gray-700">Your gateway to volunteering</p>
          <button className="mt-4">
            <img src={hero_button || "/placeholder.svg"} alt="Donate Now" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="w-full bg-beige text-black py-12 flex flex-col items-center px-4"
      >
        <div
          className={`text-2xl font-bold border-2 border-black px-8 py-3 mb-16 text-center transition-all duration-600 ${
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          IN 1,5 YEARS OF PLATFORM'S OPERATION
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12 max-w-6xl w-full">
          <AnimatedStat
            value={1}
            label="Families positively impacted"
            formatter={(value) => `${value}M$`}
            delay={0}
          />
          <AnimatedStat
            value={50000}
            label="Hours of community service provided "
            delay={1}
          />
          <AnimatedStat
            value={5}
            suffix="M"
            label="Meals distributed to those in need"
            delay={2}
          />
          <AnimatedStat
            value={1200}
            suffix="+"
            label="Nonprofits partnered with our platform"
            delay={3}
          />

          <AnimatedStat
            value={200000}
            suffix="+"
            label="Registered users on the platform"
            delay={4}
          />
          <AnimatedStat
            value={50000}
            label="Individual donors contributing to campaigns "
            delay={5}
          />
          <AnimatedStat
            value={2}
            suffix="M"
            label="People benefited from donations"
            delay={6}
          />
          <AnimatedStat
            value={3000}
            suffix="+"
            label="Crowdfunding campaigns successfully completed"
            delay={7}
          />
        </div>
      </div>
    </div>
  );
}
