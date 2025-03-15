import { AnimatedStat } from "../UI/animated-stats";
import { useIntersectionObserver } from "../../lib/use-intersection-observer";
import { useEffect, useState, useRef } from "react";
import hero_button from "../../assets/hero/hero-button.svg";
import hero_skew from "../../assets/hero/hero-skew.svg";

export default function Hero() {
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
  });
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const leftRectRef = useRef<HTMLDivElement>(null);
  const rightRectRef = useRef<HTMLDivElement>(null);
  const skewRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isInView) {
      setIsHeaderVisible(true);
      if (leftRectRef.current) {
        leftRectRef.current.style.transform = "translateX(0)";
        leftRectRef.current.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      }
      if (rightRectRef.current) {
        rightRectRef.current.style.transform = "translateX(0)";
        rightRectRef.current.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      }
    } else {
      if (leftRectRef.current) {
        leftRectRef.current.style.transform = "translateX(-100%)";
        leftRectRef.current.style.transition = "none";
      }
      if (rightRectRef.current) {
        rightRectRef.current.style.transform = "translateX(100%)";
        rightRectRef.current.style.transition = "none";
      }
    }
  }, [isInView]);

  const handleSkewHover = (isHovered: boolean) => {
    if (skewRef.current) {
      skewRef.current.style.transform = isHovered ? "scale(1.1)" : "scale(1)";
      skewRef.current.style.transition = "transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    }
  };

  return (
    <div className="bg-beige w-full">
      <div
        className="relative w-full h-[500px] flex items-center bg-beige overflow-hidden"
        onMouseEnter={() => handleSkewHover(true)}
        onMouseLeave={() => handleSkewHover(false)}
      >
        <img
          ref={skewRef}
          src={hero_skew || "/placeholder.svg"}
          alt="Skew background"
          className="absolute left-0 top-0 h-full w-auto z-10"
        />

        <div
          ref={leftRectRef}
          className="absolute left-0 top-0 w-1/4 h-full bg-white transform -translate-x-full transition-transform duration-1000 ease-out"
        ></div>

        <div className="relative z-20 ml-4 md:ml-20">
          <p className="text-4xl md:text-6xl font-bold text-black">9OUFA</p>
          <p className="text-sm md:text-lg text-gray-700">
            Your gateway to volunteering
          </p>
          <a href="\donate">
          <button className="mt-2 md:mt-4">
            <img
              src={hero_button || "/placeholder.svg"}
              alt="Donate Now"
              className="cursor-pointer"
            />
          </button>
          </a>
        </div>
      </div>

      <div
        ref={ref}
        className="w-full bg-beige text-black py-8 md:py-12 flex flex-col items-center px-4"
      >
        <div
          className={`text-xl md:text-2xl font-bold border-2 border-black px-4 md:px-8 py-2 md:py-3 mb-8 md:mb-16 text-center transition-all duration-600 ${
            isHeaderVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          IN 1.5 YEARS OF PLATFORM'S OPERATION
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12 max-w-6xl w-full">
          <AnimatedStat
            value={1}
            label="Families positively impacted"
            formatter={(value) => `${value}M`}
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